import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketStatus, TICKET_STATUS_LABELS } from '../../../../core/models/enums';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'dark';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  @Input() statut?: TicketStatus | string;
  @Input() variant: BadgeVariant = 'neutral';

  getLabel(): string {
    if (this.statut !== undefined) {
      return TICKET_STATUS_LABELS[this.statut as TicketStatus] ?? this.statut;
    }
    return '';
  }

  getBadgeClass(): string {
    if (this.statut !== undefined) {
      switch (this.statut) {
        case TicketStatus.Recu:
          return 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30';
        case TicketStatus.EnTraitement:
          return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
        case TicketStatus.Pret:
          return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 shadow-sm shadow-emerald-500/10';
        case TicketStatus.Recupere:
          return 'bg-slate-900 text-slate-200 border-slate-700';
        case TicketStatus.Annule:
          return 'bg-rose-500/10 text-rose-600 border-rose-500/30';
        default:
          return 'bg-slate-100 text-slate-700 border-slate-200';
      }
    }
    switch (this.variant) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      case 'warning':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'danger':
        return 'bg-rose-500/10 text-rose-600 border-rose-500/30';
      case 'info':
        return 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30';
      case 'dark':
        return 'bg-slate-900 text-slate-200 border-slate-700';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }

  getDotClass(): string {
    if (this.statut !== undefined) {
      switch (this.statut) {
        case TicketStatus.Recu:
          return 'bg-cyan-500 animate-pulse';
        case TicketStatus.EnTraitement:
          return 'bg-amber-500 animate-ping';
        case TicketStatus.Pret:
          return 'bg-emerald-500 animate-pulse';
        case TicketStatus.Recupere:
          return 'bg-slate-400';
        case TicketStatus.Annule:
          return 'bg-rose-500';
        default:
          return 'bg-slate-400';
      }
    }
    switch (this.variant) {
      case 'success':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      case 'danger':
        return 'bg-rose-500';
      case 'info':
        return 'bg-cyan-500';
      default:
        return 'bg-slate-400';
    }
  }
}