import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogService } from '../../../../core/services/service.service';
import { CartService } from '../../../../core/services/cart.service';
import { UiStateService } from '../../../../core/services/ui-state.service';
import { ServiceItem } from '../../../../core/models/service.model';
import { CfaCurrencyPipe } from '../../../../shared/pipes/currency-cfa.pipe';
import { SkeletonComponent } from '../../../../shared/components/ui/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, CfaCurrencyPipe, RouterLink, SkeletonComponent, EmptyStateComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {
  private serviceService = inject(CatalogService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  cart = inject(CartService);
  ui = inject(UiStateService);

  services = signal<ServiceItem[]>([]);
  selectedCategory = signal<'all' | 'costumes' | 'repassage' | 'linge'>('all');
  isLoading = signal<boolean>(true);
  loadError = signal<boolean>(false);
  searchQuery = signal('');
  heroImageFailed = signal(false);

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

    return list;
  });

  ngOnInit() {
    this.fetchServices();

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (params['category']) {
          this.selectedCategory.set(params['category']);
          setTimeout(() => this.scrollToCatalogue(), 300);
        }
      });
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

  onSearchChange(value: string) {
    this.searchQuery.set(value);
  }

  setCategoryFilter(category: 'all' | 'costumes' | 'repassage' | 'linge') {
    this.selectedCategory.set(category);
    this.scrollToCatalogue();
  }

  resetFilters() {
    this.selectedCategory.set('all');
    this.searchQuery.set('');
  }

  scrollToCatalogue() {
    const el = document.getElementById('catalogue');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setTimeout(() => {
        const retryEl = document.getElementById('catalogue');
        if (retryEl) retryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  addToCart(service: ServiceItem) {
    this.cart.addItem(service);
  }

  getInitial(libelle: string): string {
    const first = libelle.trim().charAt(0).toUpperCase();
    return first || 'P';
  }
}
