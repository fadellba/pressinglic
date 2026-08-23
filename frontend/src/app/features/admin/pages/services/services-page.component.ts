import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../../core/services/service.service';
import { SnackbarService } from '../../../../shared/components/ui/snackbar/snackbar.service';
import { ServiceItem, ServiceDTO } from '../../../../core/models/service.model';
import { ServiceFormModalComponent } from '../../../../shared/components/service-form-modal/service-form-modal.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { CfaCurrencyPipe } from '../../../../shared/pipes/currency-cfa.pipe';

@Component({
  selector: 'app-services',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ServiceFormModalComponent, ModalComponent, CfaCurrencyPipe],
  templateUrl: './services-page.component.html',
})
export class ServicesPageComponent implements OnInit {
  private serviceManagement = inject(CatalogService);
  private snackbar = inject(SnackbarService);
  private destroyRef = inject(DestroyRef);

  services = signal<ServiceItem[]>([]);
  isLoading = signal(true);

  searchQuery = signal('');
  statusFilter = signal<'all' | 'active' | 'inactive'>('all');
  sortBy = signal<'name_asc' | 'name_desc' | 'price_asc' | 'price_desc'>('name_asc');

  isModalOpen = signal(false);
  editingService = signal<ServiceItem | null>(null);
  isSaving = signal(false);
  pendingDeleteService = signal<ServiceItem | null>(null);

  filteredServices = computed(() => {
    let list = this.services();
    const query = this.searchQuery().toLowerCase().trim();

    if (query) {
      list = list.filter(
        (s) =>
          s.libelle.toLowerCase().includes(query) ||
          (s.description ? s.description.toLowerCase().includes(query) : false)
      );
    }

    const filter = this.statusFilter();
    if (filter === 'active') {
      list = list.filter((s) => s.est_actif);
    }
    if (filter === 'inactive') {
      list = list.filter((s) => !s.est_actif);
    }

    const sort = this.sortBy();
    return [...list].sort((a, b) => {
      switch (sort) {
        case 'name_asc':
          return a.libelle.localeCompare(b.libelle);
        case 'name_desc':
          return b.libelle.localeCompare(a.libelle);
        case 'price_asc':
          return a.prix_unitaire - b.prix_unitaire;
        case 'price_desc':
          return b.prix_unitaire - a.prix_unitaire;
        default:
          return 0;
      }
    });
  });

  setStatusFilter(filter: 'all' | 'active' | 'inactive') {
    this.statusFilter.set(filter);
  }

  setSort(sort: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc') {
    this.sortBy.set(sort);
  }

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.isLoading.set(true);
    this.serviceManagement
      .getServices({ all: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.services.set(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  toggleActive(service: ServiceItem) {
    this.serviceManagement
      .toggleActive(service.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackbar.success(`Le statut du service "${service.libelle}" a été basculé.`, 'Catalogue mis à jour');
          this.loadServices();
        },
      });
  }

  openModal(service: ServiceItem | null = null) {
    this.editingService.set(service);
    this.isModalOpen.set(true);
  }

  requestDelete(service: ServiceItem) {
    this.pendingDeleteService.set(service);
  }

  saveService(formData: ServiceDTO) {
    if (!formData.libelle || formData.prix_unitaire <= 0) {
      this.snackbar.error('Veuillez fournir un nom et un prix valide.', 'Validation');
      return;
    }

    this.isSaving.set(true);

    const editing = this.editingService();

    if (editing) {
      this.serviceManagement
        .updateService(editing.id, formData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.isSaving.set(false);
            this.isModalOpen.set(false);
            this.snackbar.success('Le service a été mis à jour avec succès.', 'Modifié');
            this.loadServices();
          },
          error: () => {
            this.isSaving.set(false);
          },
        });
    } else {
      this.serviceManagement
        .createService(formData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.isSaving.set(false);
            this.isModalOpen.set(false);
            this.snackbar.success('Le nouveau service a été ajouté au catalogue.', 'Service Créé');
            this.loadServices();
          },
          error: () => {
            this.isSaving.set(false);
          },
        });
    }
  }

  deleteService(service: ServiceItem) {
    this.serviceManagement
      .deleteService(service.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.pendingDeleteService.set(null);
          this.snackbar.info(`Le service "${service.libelle}" a été supprimé.`, 'Supprimé');
          this.loadServices();
        },
      });
  }
}