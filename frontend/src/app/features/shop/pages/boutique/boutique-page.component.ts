import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../../../core/services/service.service';
import { CartService } from '../../../../core/services/cart.service';
import { UiStateService } from '../../../../core/services/ui-state.service';
import { ServiceItem } from '../../../../core/models/service.model';
import { CfaCurrencyPipe } from '../../../../shared/pipes/currency-cfa.pipe';
import { SkeletonComponent } from '../../../../shared/components/ui/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';

type Category = 'all' | 'costumes' | 'repassage' | 'linge';
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

@Component({
  selector: 'app-boutique',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, CfaCurrencyPipe, RouterLink, SkeletonComponent, EmptyStateComponent],
  templateUrl: './boutique-page.component.html',
})
export class BoutiquePageComponent implements OnInit {
  private serviceService = inject(CatalogService);
  private destroyRef = inject(DestroyRef);
  cart = inject(CartService);
  ui = inject(UiStateService);

  services = signal<ServiceItem[]>([]);
  selectedCategory = signal<Category>('all');
  isLoading = signal<boolean>(true);
  loadError = signal<boolean>(false);
  searchQuery = signal('');
  sortBy = signal<SortOption>('default');

  filteredServices = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();
    let list = this.services();

    if (cat === 'costumes') {
      list = list.filter((s) =>
        s.libelle.toLowerCase().includes('costume') ||
        s.libelle.toLowerCase().includes('veste') ||
        s.libelle.toLowerCase().includes('pantalon') ||
        s.libelle.toLowerCase().includes('robe') ||
        s.libelle.toLowerCase().includes('sec')
      );
    } else if (cat === 'repassage') {
      list = list.filter((s) =>
        s.libelle.toLowerCase().includes('repassage') ||
        s.libelle.toLowerCase().includes('chemise')
      );
    } else if (cat === 'linge') {
      list = list.filter((s) =>
        s.libelle.toLowerCase().includes('couette') ||
        s.libelle.toLowerCase().includes('linge') ||
        s.libelle.toLowerCase().includes('drap')
      );
    }

    if (query) {
      list = list.filter(
        (s) =>
          s.libelle.toLowerCase().includes(query) ||
          (s.description && s.description.toLowerCase().includes(query))
      );
    }

    switch (this.sortBy()) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.prix_unitaire - b.prix_unitaire);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.prix_unitaire - a.prix_unitaire);
        break;
      case 'name-asc':
        list = [...list].sort((a, b) => a.libelle.localeCompare(b.libelle, 'fr'));
        break;
    }

    return list;
  });

  ngOnInit() {
    this.fetchServices();
  }

  fetchServices() {
    this.isLoading.set(true);
    this.loadError.set(false);
    this.serviceService
      .getServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.services.set(data.filter((s) => s.est_actif));
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Erreur chargement services:', err);
          this.isLoading.set(false);
          this.loadError.set(true);
        },
      });
  }

  setCategoryFilter(category: Category) {
    this.selectedCategory.set(category);
  }

  setSort(sort: SortOption) {
    this.sortBy.set(sort);
  }

  resetFilters() {
    this.selectedCategory.set('all');
    this.searchQuery.set('');
    this.sortBy.set('default');
  }

  addToCart(service: ServiceItem) {
    this.cart.addItem(service);
  }

  getInitial(libelle: string): string {
    const first = libelle.trim().charAt(0).toUpperCase();
    return first || 'P';
  }
}