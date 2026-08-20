import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocusTrapDirective } from '../../../directives/focus-trap.directive';

export type ModalConfirmVariant = 'danger' | 'primary';

@Component({
  selector: 'app-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FocusTrapDirective],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) message!: string;
  @Input() confirmLabel = 'Confirmer';
  @Input() confirmVariant: ModalConfirmVariant = 'danger';
  @Output() confirmed = new EventEmitter<void>();
  @Output() dismissed = new EventEmitter<void>();
}