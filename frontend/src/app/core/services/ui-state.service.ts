import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiStateService {
  readonly isAuthModalOpen = signal(false);
  readonly authModalMode = signal<'login' | 'register'>('login');
  readonly postAuthCallback = signal<(() => void) | null>(null);
  readonly isCartDrawerOpen = signal(false);

  openAuthModal(mode: 'login' | 'register' = 'login', onSuccess?: () => void) {
    this.authModalMode.set(mode);
    if (onSuccess) {
      this.postAuthCallback.set(onSuccess);
    }
    this.isAuthModalOpen.set(true);
  }

  closeAuthModal() {
    this.isAuthModalOpen.set(false);
  }

  openCartDrawer() {
    this.isCartDrawerOpen.set(true);
  }

  closeCartDrawer() {
    this.isCartDrawerOpen.set(false);
  }
}