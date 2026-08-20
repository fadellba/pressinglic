import { Injectable, computed, inject, signal } from '@angular/core';
import { ServiceItem } from '../models/service.model';
import { SnackbarService } from '../../shared/components/ui/snackbar/snackbar.service';
import { STORAGE_PROVIDER } from '../storage/storage-provider';

const CART_KEY = 'pressing_cart';

export interface CartItem {
  service: ServiceItem;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private snackbar = inject(SnackbarService);
  private storage = inject(STORAGE_PROVIDER);
  readonly MAX_QTY_PER_ITEM = 20;

  readonly items = signal<CartItem[]>(this.loadCartFromStorage());

  readonly totalCount = computed(() =>
    this.items().reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly totalAmount = computed(() =>
    this.items().reduce((acc, item) => acc + item.quantity * item.service.prix_unitaire, 0)
  );

  readonly isEmpty = computed(() => this.items().length === 0);

  private isValidCartItem(item: unknown): item is CartItem {
    if (!item || typeof item !== 'object') return false;
    const candidate = item as Partial<CartItem>;
    const service = candidate.service as Partial<ServiceItem> | undefined;
    return (
      typeof candidate.quantity === 'number' &&
      !!service &&
      typeof service.id === 'number' &&
      typeof service.libelle === 'string' &&
      typeof service.prix_unitaire === 'number'
    );
  }

  private loadCartFromStorage(): CartItem[] {
    const raw = this.storage.get(CART_KEY);
    if (!raw) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item): item is CartItem => this.isValidCartItem(item));
    } catch {
      return [];
    }
  }

  private syncStorage(currentItems: CartItem[]) {
    this.storage.set(CART_KEY, JSON.stringify(currentItems));
  }

  addItem(service: ServiceItem, qty = 1) {
    if (!service.est_actif) {
      this.snackbar.error(`Le service "${service.libelle}" n'est actuellement pas disponible.`, 'Indisponible');
      return;
    }

    const current = this.items();
    const existingIndex = current.findIndex((item) => item.service.id === service.id);

    if (existingIndex > -1) {
      const newQty = current[existingIndex].quantity + qty;
      if (newQty > this.MAX_QTY_PER_ITEM) {
        this.snackbar.warning(
          `Vous ne pouvez pas ajouter plus de ${this.MAX_QTY_PER_ITEM} unité(s) pour le service "${service.libelle}".`,
          'Limite de quantité atteinte'
        );
        return;
      }
      const updated = [...current];
      updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
      this.items.set(updated);
      this.syncStorage(updated);
      this.snackbar.success(`${qty}x ${service.libelle} ajouté(s) au panier.`, 'Panier mis à jour');
    } else {
      if (qty > this.MAX_QTY_PER_ITEM) {
        this.snackbar.warning(
          `La quantité maximale autorisée est de ${this.MAX_QTY_PER_ITEM} unité(s).`,
          'Limite atteinte'
        );
        return;
      }
      const updated = [...current, { service, quantity: qty }];
      this.items.set(updated);
      this.syncStorage(updated);
      this.snackbar.success(`${service.libelle} ajouté au panier.`, 'Ajouté au panier');
    }
  }

  updateQuantity(serviceId: number, delta: number) {
    const current = this.items();
    const existingIndex = current.findIndex((item) => item.service.id === serviceId);

    if (existingIndex === -1) return;

    const currentItem = current[existingIndex];
    const targetQty = currentItem.quantity + delta;

    if (targetQty <= 0) {
      this.removeItem(serviceId);
      return;
    }

    if (targetQty > this.MAX_QTY_PER_ITEM) {
      this.snackbar.warning(
        `Limite maximale de ${this.MAX_QTY_PER_ITEM} articles atteinte pour "${currentItem.service.libelle}".`,
        'Quantité maximale'
      );
      return;
    }

    const updated = [...current];
    updated[existingIndex] = { ...updated[existingIndex], quantity: targetQty };
    this.items.set(updated);
    this.syncStorage(updated);
  }

  removeItem(serviceId: number) {
    const current = this.items();
    const itemToRemove = current.find((i) => i.service.id === serviceId);
    const updated = current.filter((item) => item.service.id !== serviceId);
    this.items.set(updated);
    this.syncStorage(updated);

    if (itemToRemove) {
      this.snackbar.info(`"${itemToRemove.service.libelle}" a été retiré de votre panier.`, 'Panier');
    }
  }

  clearCart() {
    this.items.set([]);
    this.storage.remove(CART_KEY);
  }

  syncPrices(services: ServiceItem[]): boolean {
    const current = this.items();
    let changed = false;
    const updated = current.map((item) => {
      const fresh = services.find((s) => s.id === item.service.id);
      if (!fresh) return item;
      if (
        fresh.prix_unitaire !== item.service.prix_unitaire ||
        fresh.libelle !== item.service.libelle ||
        fresh.est_actif !== item.service.est_actif
      ) {
        changed = true;
        return { ...item, service: { ...fresh } };
      }
      return item;
    });

    if (changed) {
      this.items.set(updated);
      this.syncStorage(updated);
    }
    return changed;
  }
}