import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService } from './snackbar.service';
import { ToastType } from '../../../../core/models/toast.model';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
})
export class SnackbarComponent {
  snackbar = inject(SnackbarService);

  getToastStyles(type: ToastType): string {
    switch (type) {
      case 'success':
        return 'bg-white/95 border-emerald-200 text-slate-800 ring-1 ring-emerald-500/20';
      case 'error':
        return 'bg-white/95 border-rose-200 text-slate-800 ring-1 ring-rose-500/20';
      case 'warning':
        return 'bg-white/95 border-amber-200 text-slate-800 ring-1 ring-amber-500/20';
      case 'info':
      default:
        return 'bg-white/95 border-cyan-200 text-slate-800 ring-1 ring-cyan-500/20';
    }
  }
}