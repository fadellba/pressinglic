import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../../../core/services/ticket.service';
import { SnackbarService } from '../../../../shared/components/ui/snackbar/snackbar.service';
import { Ticket } from '../../../../core/models/ticket.model';
import { TicketStatus } from '../../../../core/models/enums';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CfaCurrencyPipe } from '../../../../shared/pipes/currency-cfa.pipe';
import { PageHeaderComponent } from '../../../../shared/components/ui/page-header/page-header.component';
import { SkeletonComponent } from '../../../../shared/components/ui/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { PaginationComponent } from '../../../../shared/components/ui/pagination/pagination.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, BadgeComponent, CfaCurrencyPipe, PageHeaderComponent, SkeletonComponent, EmptyStateComponent, PaginationComponent, ModalComponent],
  templateUrl: './my-tickets-page.component.html',
})
export class MyTicketsPageComponent implements OnInit {
  private ticketService = inject(TicketService);
  private snackbar = inject(SnackbarService);
  private destroyRef = inject(DestroyRef);

  tickets = signal<Ticket[]>([]);
  activeFilter = signal<'all' | 'active' | 'pret'>('all');
  isLoading = signal(true);

  pendingCancelTicket = signal<Ticket | null>(null);

  currentPage = signal(1);
  readonly pageSize = 10;

  currentServerPage = signal(1);
  hasMoreTickets = signal(false);
  isLoadingMore = signal(false);

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.isLoading.set(true);
    this.ticketService
      .getTickets(1)
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

    this.isLoadingMore.set(true);
    this.ticketService
      .getTickets(this.currentServerPage() + 1)
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

  filteredTickets = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'active') {
      return this.tickets().filter(
        (t) => t.statut === TicketStatus.Recu || t.statut === TicketStatus.EnTraitement
      );
    }
    if (filter === 'pret') {
      return this.tickets().filter((t) => t.statut === TicketStatus.Pret);
    }
    return this.tickets();
  });

  displayPage = computed(() =>
    Math.min(this.currentPage(), Math.max(1, Math.ceil(this.filteredTickets().length / this.pageSize)))
  );

  pagedTickets = computed(() => {
    const start = (this.displayPage() - 1) * this.pageSize;
    return this.filteredTickets().slice(start, start + this.pageSize);
  });

  setFilter(filter: 'all' | 'active' | 'pret') {
    this.currentPage.set(1);
    this.activeFilter.set(filter);
  }

  canCancel(ticket: Ticket): boolean {
    return ticket.statut === TicketStatus.Recu || ticket.statut === TicketStatus.EnTraitement;
  }

  requestCancel(ticket: Ticket) {
    this.pendingCancelTicket.set(ticket);
  }

  confirmCancel() {
    const ticket = this.pendingCancelTicket();
    if (!ticket) return;

    this.ticketService
      .cancelTicket(ticket.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.pendingCancelTicket.set(null);
          this.snackbar.success(`La commande ${ticket.code_ticket} a été annulée.`, 'Commande Annulée');
          this.loadTickets();
        },
        error: () => {
          this.pendingCancelTicket.set(null);
          this.snackbar.error('Impossible d\'annuler cette commande.', 'Erreur');
          this.loadTickets();
        },
      });
  }

  downloadReceipt(ticket: Ticket) {
    this.snackbar.info('Génération du fichier PDF en cours...', 'Téléchargement');
    this.ticketService
      .downloadReceipt(ticket.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Recu_Pressing_${ticket.code_ticket}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.snackbar.success('Le reçu PDF a été téléchargé avec succès.', 'Téléchargement');
      },
      error: () => {
        this.snackbar.error('Impossible de télécharger le reçu PDF pour le moment.', 'Erreur');
      },
    });
  }
}
