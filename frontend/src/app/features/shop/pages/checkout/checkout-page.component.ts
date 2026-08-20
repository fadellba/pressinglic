import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '../../../../core/services/cart.service';
import { SessionService } from '../../../../core/auth/session.service';
import { CatalogService } from '../../../../core/services/service.service';
import { TicketService } from '../../../../core/services/ticket.service';
import { SnackbarService } from '../../../../shared/components/ui/snackbar/snackbar.service';
import { UiStateService } from '../../../../core/services/ui-state.service';
import { CfaCurrencyPipe } from '../../../../shared/pipes/currency-cfa.pipe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink, CfaCurrencyPipe],
  templateUrl: './checkout-page.component.html',
})
export class CheckoutPageComponent implements OnInit {
  cart = inject(CartService);
  session = inject(SessionService);
  private ui = inject(UiStateService);
  private ticketService = inject(TicketService);
  private serviceService = inject(CatalogService);
  private snackbar = inject(SnackbarService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  notes = signal('');
  isSubmitting = signal(false);

  ngOnInit() {
    if (this.session.isAuthenticated() && !this.cart.isEmpty()) {
      this.serviceService
        .getServices()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (services) => {
            if (this.cart.syncPrices(services)) {
              this.snackbar.warning(
                'Certains tarifs ont été mis à jour. Vérifiez le nouveau montant avant de confirmer.',
                'Prix actualisés'
              );
            }
          },
        });
    }
  }

  submitTicket() {
    if (!this.session.isAuthenticated()) {
      this.ui.openAuthModal('login', () => {
        this.submitTicket();
      });
      return;
    }

    if (this.cart.isEmpty()) {
      this.snackbar.error('Votre panier est vide.', 'Erreur');
      return;
    }

    const payload = {
      notes: this.notes(),
      items: this.cart.items().map((item) => ({
        service_id: item.service.id,
        quantite: item.quantity,
      })),
    };

    this.isSubmitting.set(true);
    this.ticketService.createTicket(payload).subscribe({
      next: (ticket) => {
        this.isSubmitting.set(false);
        this.cart.clearCart();
        this.snackbar.success(`Votre commande n° ${ticket.code_ticket} a été enregistrée avec succès !`, 'Dépôt Réussi');
        this.router.navigate(['/client/my-tickets']);
      },
      error: () => {
        this.isSubmitting.set(false);
      },
    });
  }
}