import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ServiceItem, ServiceDTO } from '../models/service.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private api = inject(ApiService);

  getServices(params?: { all?: boolean }): Observable<ServiceItem[]> {
    return this.api.getUnwrapped<ServiceItem>('/services', params);
  }

  createService(data: ServiceDTO): Observable<ServiceItem> {
    const payload = {
      libelle: data.libelle,
      prix_unitaire: data.prix_unitaire,
      description: data.description || '',
      est_actif: data.est_actif !== undefined ? data.est_actif : true,
    };
    return this.unwrap(this.api.post<{ data: ServiceItem }>('/services', payload));
  }

  updateService(id: number, data: ServiceDTO): Observable<ServiceItem> {
    const payload = {
      libelle: data.libelle,
      prix_unitaire: data.prix_unitaire,
      description: data.description || '',
      est_actif: data.est_actif !== undefined ? data.est_actif : true,
    };
    return this.unwrap(this.api.put<{ data: ServiceItem }>(`/services/${id}`, payload));
  }

  toggleActive(id: number): Observable<ServiceItem> {
    return this.unwrap(this.api.patch<{ data: ServiceItem }>(`/services/${id}/toggle-active`, {}));
  }

  deleteService(id: number): Observable<void> {
    return this.api.delete(`/services/${id}`);
  }

  private unwrap<T>(obs: Observable<{ data: T }>): Observable<T> {
    return obs.pipe(map((res) => res.data));
  }
}