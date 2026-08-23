import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { SessionService } from '../../../core/auth/session.service';
import { UiStateService } from '../../../core/services/ui-state.service';
import { CfaCurrencyPipe } from '../../pipes/currency-cfa.pipe';
import { FocusTrapDirective } from '../../directives/focus-trap.directive';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CfaCurrencyPipe, FocusTrapDirective],
  templateUrl: './cart-drawer.component.html',
})
export class CartDrawerComponent {
  cart = inject(CartService);
  session = inject(SessionService);
  ui = inject(UiStateService);
  private router = inject(Router);

  proceedToCheckout() {
    this.ui.closeCartDrawer();
    if (this.session.isAuthenticated()) {
      this.router.navigate(['/checkout']);
    } else {
      this.ui.openAuthModal('login', () => {
        this.router.navigate(['/checkout']);
      });
    }
  }
}
