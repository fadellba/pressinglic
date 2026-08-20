import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Payment, PaymentCreateDTO } from '../../../core/models/payment.model';
import { PaymentMode } from '../../../core/models/enums';
import { ApiService } from '../../../core/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private api = inject(ApiService);

  recordPayment(dto: PaymentCreateDTO): Observable<Payment> {
    const payload = {
      ticket_id: dto.ticket_id,
      montant: dto.montant,
      mode_paiement: dto.mode_paiement || PaymentMode.Especes,
    };
    return this.api.post<{ data: Payment }>('/payments', payload).pipe(map((res) => res.data));
  }
}