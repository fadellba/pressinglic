import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Ticket, TicketCreateDTO } from '../models/ticket.model';
import { TicketStatus } from '../models/enums';
import { ApiService } from '../api/api.service';

export interface TicketsPage {
  data: Ticket[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private api = inject(ApiService);

  getTickets(page = 1, search?: string, statut?: string): Observable<TicketsPage> {
    const params: Record<string, string | number> = { page };
    if (search && search.trim()) {
      params['search'] = search.trim();
    }
    if (statut && statut !== 'all') {
      params['statut'] = statut;
    }
    return this.api.get<TicketsPage>('/tickets', params);
  }

  createTicket(dto: TicketCreateDTO): Observable<Ticket> {
    return this.unwrap(this.api.post<{ data: Ticket }>('/tickets', dto));
  }

  updateStatus(id: number, status: TicketStatus): Observable<Ticket> {
    return this.unwrap(this.api.patch<{ data: Ticket }>(`/tickets/${id}/status`, { statut: status }));
  }

  cancelTicket(id: number): Observable<Ticket> {
    return this.unwrap(this.api.post<{ data: Ticket }>(`/tickets/${id}/cancel`, {}));
  }

  downloadReceipt(id: number): Observable<Blob> {
    return this.api.download(`/tickets/${id}/receipt`);
  }

  private unwrap<T>(obs: Observable<{ data: T }>): Observable<T> {
    return obs.pipe(map((res) => res.data));
  }
}