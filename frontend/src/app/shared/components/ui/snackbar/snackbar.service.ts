import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../../../../core/models/toast.model';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', title?: string, duration = 4000) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, type, title, message };

    this.toasts.update((current) => [...current, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, title = 'Succès') {
    this.show(message, 'success', title);
  }

  error(message: string, title = 'Erreur') {
    this.show(message, 'error', title, 6000);
  }

  warning(message: string, title = 'Avertissement') {
    this.show(message, 'warning', title, 5000);
  }

  info(message: string, title = 'Information') {
    this.show(message, 'info', title);
  }

  remove(id: string) {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}