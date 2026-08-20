import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { StatMetrics } from '../../../core/models/stat.model';
import { ApiService } from '../../../core/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class StatService {
  private api = inject(ApiService);

  getStats(): Observable<StatMetrics> {
    return this.api.get<{ data: StatMetrics }>('/stats').pipe(map((res) => res.data));
  }
}