import { PaymentMode } from './enums';
import { User } from './user.model';

export interface Payment {
  id: number;
  ticket_id: number;
  montant: number;
  mode_paiement: PaymentMode;
  enregistre_par?: User | null;
  created_at: string;
}

export interface PaymentCreateDTO {
  ticket_id: number;
  montant: number;
  mode_paiement?: PaymentMode;
}