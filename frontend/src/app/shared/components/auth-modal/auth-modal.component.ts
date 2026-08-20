import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { ApiError } from '../../../core/api/api-error';
import { UiStateService } from '../../../core/services/ui-state.service';
import { FocusTrapDirective } from '../../directives/focus-trap.directive';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, FocusTrapDirective],
  templateUrl: './auth-modal.component.html',
})
export class AuthModalComponent {
  ui = inject(UiStateService);
  private auth = inject(AuthService);

  isLoading = signal(false);
  errorMessage = signal('');

  loginData = {
    email: '',
    password: '',
  };

  registerData = {
    name: '',
    email: '',
    phone: '',
    password: '',
  };

  closeOnBackdrop(event: Event) {
    if (event.target === event.currentTarget) {
      this.ui.closeAuthModal();
    }
  }

  switchMode(mode: 'login' | 'register') {
    this.ui.authModalMode.set(mode);
    this.errorMessage.set('');
  }

  async onLogin() {
    if (!this.loginData.email || !this.loginData.password) return;
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      await this.auth.login(this.loginData);
      this.isLoading.set(false);
      this.loginData = { email: '', password: '' };
    } catch (err) {
      this.isLoading.set(false);
      this.errorMessage.set(this.messageFromError(err));
    }
  }

  async onRegister() {
    if (!this.registerData.name || !this.registerData.email || !this.registerData.password) return;
    if (this.registerData.password.length < 8) {
      this.errorMessage.set('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      await this.auth.register({
        name: this.registerData.name,
        email: this.registerData.email,
        phone: this.registerData.phone,
        password: this.registerData.password,
        password_confirmation: this.registerData.password,
      });
      this.isLoading.set(false);
      this.registerData = { name: '', email: '', phone: '', password: '' };
    } catch (err) {
      this.isLoading.set(false);
      this.errorMessage.set(this.messageFromError(err));
    }
  }

  private messageFromError(err: unknown): string {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        return 'Email ou mot de passe incorrect. Veuillez réessayer.';
      }
      const firstFieldError = err.errors ? Object.values(err.errors)[0]?.[0] : null;
      if (firstFieldError) return firstFieldError;
      return err.message;
    }
    return 'Une erreur est survenue. Vérifiez votre connexion et réessayez.';
  }
}