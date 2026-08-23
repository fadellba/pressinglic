import { Injectable, computed, signal } from '@angular/core';
import { User } from '../models/user.model';
import { UserRole } from '../models/enums';

@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly user = signal<User | null>(null);
  readonly isAuthenticated = signal(false);

  readonly isManager = computed(() => this.user()?.role === UserRole.Gestionnaire);
  readonly isClient = computed(() => this.user()?.role === UserRole.Client);

  setUser(user: User | null): void {
    this.user.set(user);
    this.isAuthenticated.set(user !== null);
  }

  clear(): void {
    this.user.set(null);
    this.isAuthenticated.set(false);
  }
}