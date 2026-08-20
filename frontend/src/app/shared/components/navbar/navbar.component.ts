import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { SessionService } from '../../../core/auth/session.service';
import { CartService } from '../../../core/services/cart.service';
import { UiStateService } from '../../../core/services/ui-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  session = inject(SessionService);
  cart = inject(CartService);
  ui = inject(UiStateService);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly mobileOpen = signal(false);

  toggleMobileMenu(): void {
    this.mobileOpen.update((value) => !value);
  }

  closeMobileMenu(): void {
    this.mobileOpen.set(false);
  }

  async logout() {
    try {
      await this.auth.logout();
    } catch {
      void 0;
    }
    this.closeMobileMenu();
    await this.router.navigate(['/']);
  }
}