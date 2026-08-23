import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../../core/models/ticket.model';
import { CfaCurrencyPipe } from '../../pipes/currency-cfa.pipe';
import { FocusTrapDirective } from '../../directives/focus-trap.directive';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CfaCurrencyPipe, FocusTrapDirective],
  templateUrl: './payment-modal.component.html',
})
export class PaymentModalComponent {
  @Input({ required: true }) ticket!: Ticket;
  @Input() isProcessing = false;
  @Output() confirmed = new EventEmitter<void>();
  @Output() dismissed = new EventEmitter<void>();
}