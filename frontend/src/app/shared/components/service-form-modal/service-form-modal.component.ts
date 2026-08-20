import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceItem, ServiceDTO } from '../../../core/models/service.model';
import { FocusTrapDirective } from '../../directives/focus-trap.directive';

@Component({
  selector: 'app-service-form-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, FocusTrapDirective],
  templateUrl: './service-form-modal.component.html',
})
export class ServiceFormModalComponent implements OnChanges {
  @Input() editingService: ServiceItem | null = null;
  @Input() isSaving = false;
  @Output() saved = new EventEmitter<ServiceDTO>();
  @Output() dismissed = new EventEmitter<void>();

  formData = {
    libelle: '',
    prix_unitaire: 0,
    description: '',
    est_actif: true,
  };

  ngOnChanges() {
    if (this.editingService) {
      this.formData = {
        libelle: this.editingService.libelle,
        prix_unitaire: this.editingService.prix_unitaire,
        description: this.editingService.description || '',
        est_actif: this.editingService.est_actif,
      };
    } else {
      this.formData = {
        libelle: '',
        prix_unitaire: 0,
        description: '',
        est_actif: true,
      };
    }
  }

  onSubmit() {
    this.saved.emit(this.formData);
  }
}