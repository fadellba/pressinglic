import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { SessionService } from '../../core/auth/session.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  session = inject(SessionService);
  private auth = inject(AuthService);
  private router = inject(Router);

  async logout() {
    try {
      await this.auth.logout();
    } catch {
      void 0;
    }
    await this.router.navigate(['/']);
  }
}