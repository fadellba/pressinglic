import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, finalize, of, Subject, switchMap } from 'rxjs';
import { TicketService } from '../../../../core/services/ticket.service';
import { PaymentService } from '../../services/payment.service';
import { SnackbarService } from '../../../../shared/components/ui/snackbar/snackbar.service';
import { Ticket } from '../../../../core/models/ticket.model';
import {
  TICKET_STATUS_FILTER_LABELS,
  TICKET_STATUS_LABELS,
  TICKET_STATUS_ORDER,
  TicketStatus,
  PaymentMode,
} from '../../../../core/models/enums';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { PaymentModalComponent } from '../../../../shared/components/payment-modal/payment-modal.component';
import { PaginationComponent } from '../../../../shared/components/ui/pagination/pagination.component';
import { CfaCurrencyPipe } from '../../../../shared/pipes/currency-cfa.pipe';

@Component({
  selector: 'app-tickets',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, BadgeComponent, PaymentModalComponent, PaginationComponent, CfaCurrencyPipe],
  templateUrl: './tickets-page.component.html',
})
export class TicketsPageComponent implements OnInit {
  private ticketService = inject(TicketService);
  private paymentService = inject(PaymentService);
  private snackbar = inject(SnackbarService);
  private destroyRef = inject(DestroyRef);

  tickets = signal<Ticket[]>([]);
  selectedStatusFilter = signal<'all' | 'recu' | 'en_traitement' | 'pret'>('all');
  searchQuery = signal('');
  isLoading = signal(true);

  readonly statusOrder = TICKET_STATUS_ORDER;
  readonly statusLabels = TICKET_STATUS_LABELS;
  readonly statusFilterLabels = TICKET_STATUS_FILTER_LABELS;

  private readonly transitions: Record<TicketStatus, TicketStatus[]> = {
    [TicketStatus.Recu]: [TicketStatus.EnTraitement, TicketStatus.Annule],
    [TicketStatus.EnTraitement]: [TicketStatus.Pret, TicketStatus.Annule],
    [TicketStatus.Pret]: [TicketStatus.Recupere],
    [TicketStatus.Recupere]: [],
    [TicketStatus.Annule]: [],
  };

  currentPage = signal(1);
  readonly pageSize = 10;

  currentServerPage = signal(1);
  hasMoreTickets = signal(false);
  isLoadingMore = signal(false);

  private readonly searchSubject = new Subject<string>();

  selectedTicketForPayment = signal<Ticket | null>(null);
  pendingTargetStatus = signal<TicketStatus | null>(null);
  isProcessingPayment = signal(false);

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(350), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.reloadFromServer());
    this.loadTickets();
  }

  private currentParams() {
    return {
      search: this.searchQuery().trim() || undefined,
      statut: this.selectedStatusFilter() === 'all' ? undefined : this.selectedStatusFilter(),
    };
  }

  private reloadFromServer() {
    this.currentServerPage.set(1);
    this.loadTickets();
  }

  loadTickets() {
    const { search, statut } = this.currentParams();
    this.isLoading.set(true);
    this.ticketService
      .getTickets(1, search, statut)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (page) => {
          this.tickets.set(page.data);
          this.currentServerPage.set(page.meta.current_page);
          this.hasMoreTickets.set(page.meta.current_page < page.meta.last_page);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  loadMoreTickets() {
    if (this.isLoadingMore() || !this.hasMoreTickets()) return;

    const { search, statut } = this.currentParams();
    this.isLoadingMore.set(true);
    this.ticketService
      .getTickets(this.currentServerPage() + 1, search, statut)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (page) => {
          this.tickets.update((existing) => [...existing, ...page.data]);
          this.currentServerPage.set(page.meta.current_page);
          this.hasMoreTickets.set(page.meta.current_page < page.meta.last_page);
          this.isLoadingMore.set(false);
        },
        error: () => {
          this.isLoadingMore.set(false);
        },
      });
  }

  displayPage = computed(() =>
    Math.min(this.currentPage(), Math.max(1, Math.ceil(this.tickets().length / this.pageSize)))
  );

  pagedTickets = computed(() => {
    const start = (this.displayPage() - 1) * this.pageSize;
    return this.tickets().slice(start, start + this.pageSize);
  });

  onSearchChange(value: string) {
    this.searchQuery.set(value);
    this.searchSubject.next(value);
  }

  setStatusFilter(filter: 'all' | 'recu' | 'en_traitement' | 'pret') {
    this.selectedStatusFilter.set(filter);
    this.reloadFromServer();
  }

  validTransitionsFor(ticket: Ticket): TicketStatus[] {
    return this.transitions[ticket.statut] ?? [];
  }

  canTransitionTo(ticket: Ticket, status: TicketStatus): boolean {
    return this.validTransitionsFor(ticket).includes(status);
  }

  onStatusChange(ticket: Ticket, newStatus: TicketStatus) {
    if (newStatus === TicketStatus.Recupere && !ticket.est_paye) {
      this.selectedTicketForPayment.set(ticket);
      this.pendingTargetStatus.set(newStatus);
      this.snackbar.warning('Le ticket doit être payé avant d\'être marqué comme Récupéré.', 'Règlement Obligatoire');
      return;
    }

    this.ticketService
      .updateStatus(ticket.id, newStatus)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackbar.success(`Le statut du ticket ${ticket.code_ticket} a été mis à jour avec succès.`, 'Statut Modifié');
          this.loadTickets();
        },
        error: () => {
          this.snackbar.error('Impossible de mettre à jour le statut du ticket.', 'Erreur');
          this.loadTickets();
        },
      });
  }

  openPaymentModal(ticket: Ticket) {
    this.selectedTicketForPayment.set(ticket);
    this.pendingTargetStatus.set(null);
  }

  confirmPaymentAndSetRetrieved() {
    const ticket = this.selectedTicketForPayment();
    if (!ticket) return;

    this.isProcessingPayment.set(true);
    let paymentRecorded = false;

    this.paymentService
      .recordPayment({
        ticket_id: ticket.id,
        montant: ticket.montant_total,
        mode_paiement: PaymentMode.Especes,
      })
      .pipe(
        switchMap(() => {
          paymentRecorded = true;
          return this.pendingTargetStatus() === TicketStatus.Recupere
            ? this.ticketService.updateStatus(ticket.id, TicketStatus.Recupere)
            : of(null);
        }),
        finalize(() => this.isProcessingPayment.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.snackbar.success(`Encaissement de ${ticket.montant_total} FCFA validé.`, 'Paiement Enregistré');
          this.selectedTicketForPayment.set(null);
          this.pendingTargetStatus.set(null);
          this.loadTickets();
        },
        error: () => {
          this.snackbar.error(
            paymentRecorded
              ? 'Paiement enregistré, mais le statut du ticket n\'a pas pu être mis à jour.'
              : 'Le paiement a échoué. Réessayez.',
            'Opération Incomplète'
          );
          this.selectedTicketForPayment.set(null);
          this.pendingTargetStatus.set(null);
          this.loadTickets();
        },
      });
  }
}