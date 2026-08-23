import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocusTrapDirective } from '../../../directives/focus-trap.directive';

export type ModalConfirmVariant = 'danger' | 'primary';

@Component({
  selector: 'app-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // FocusTrapDirective: gere le focus claivier
  imports: [CommonModule, FocusTrapDirective],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  /*!: indique à TypeScript que cette propriété sera bien définie au moment où elle sera utilisée.*/
  @Input({ required: true }) title!: string;
  @Input({ required: true }) message!: string;
  @Input() confirmLabel = 'Confirmer';
  @Input() confirmVariant: ModalConfirmVariant = 'danger';
  /*
  Elle informe le parent de ce qui vient de se passer avec @Output()
  EventEmitter<void>(): Permet de signaler qu'un evennement a eu lieu
  */
  @Output() confirmed = new EventEmitter<void>();
  @Output() dismissed = new EventEmitter<void>();
}