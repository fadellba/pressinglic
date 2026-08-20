import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../api/api.service';
import { SessionService } from './session.service';
import { TokenStorage } from './token-storage.service';
import { User, AuthResponse } from '../models/user.model';
import { SnackbarService } from '../../shared/components/ui/snackbar/snackbar.service';
import { UiStateService } from '../services/ui-state.service';

interface ApiEnvelope<T> {
  data: T;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);
  private readonly tokenStorage = inject(TokenStorage);
  private readonly snackbar = inject(SnackbarService);
  private readonly ui = inject(UiStateService);

  constructor() {
    if (this.tokenStorage.hasToken() && !this.session.isAuthenticated()) {
      void this.restoreSession();
    }
  }

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const { data } = await firstValueFrom(this.api.post<ApiEnvelope<AuthResponse>>('/login', credentials));
    this.applySession(data);
    this.snackbar.success(`Bienvenue, ${data.user.name} !`, 'Connexion réussie');
    this.handlePostAuthCallback();
    return data;
  }

  async register(data: RegisterPayload): Promise<AuthResponse> {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
      phone: data.phone ?? null,
    };
    const { data: authRes } = await firstValueFrom(this.api.post<ApiEnvelope<AuthResponse>>('/register', payload));
    this.applySession(authRes);
    this.snackbar.success('Votre compte client a été créé avec succès.', 'Bienvenue');
    this.handlePostAuthCallback();
    return authRes;
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.api.post<void>('/logout', {}));
    } finally {
      this.clearSession();
      this.snackbar.info('Vous êtes déconnecté.');
    }
  }

  async restoreSession(): Promise<User | null> {
    if (!this.tokenStorage.hasToken() || this.session.isAuthenticated()) {
      return this.session.user();
    }
    try {
      const { user } = await firstValueFrom(this.api.get<{ user: User }>('/me'));
      this.session.setUser(user);
      return user;
    } catch {
      this.clearSession();
      return null;
    }
  }

  private applySession(authRes: AuthResponse): void {
    this.tokenStorage.setToken(authRes.token);
    this.session.setUser(authRes.user);
  }

  clearSession(): void {
    this.tokenStorage.clear();
    this.session.clear();
  }

  private handlePostAuthCallback(): void {
    const cb = this.ui.postAuthCallback();
    if (cb) {
      this.ui.postAuthCallback.set(null);
      cb();
    }
    this.ui.closeAuthModal();
  }
}