import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CartDrawerComponent } from '../../shared/components/cart-drawer/cart-drawer.component';
import { AuthModalComponent } from '../../shared/components/auth-modal/auth-modal.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CartDrawerComponent, AuthModalComponent],
  templateUrl: './public-layout.component.html',
})
export class PublicLayoutComponent {}