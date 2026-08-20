import { TicketStatus } from './enums';
import { User } from './user.model';

export interface TicketItem {
  id: number;
  service_id: number;
  service_libelle: string;
  prix_unitaire: number;
  quantite: number;
  sous_total: number;
}

export interface Ticket {
  id: number;
  code_ticket: string;
  client_id: number;
  statut: TicketStatus;
  montant_total: number;
  est_paye: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  client?: User;
  items?: TicketItem[];
}

export interface TicketCreateDTO {
  notes?: string;
  items: {
    service_id: number;
    quantite: number;
  }[];
}