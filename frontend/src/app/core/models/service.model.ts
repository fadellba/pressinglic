export interface ServiceItem {
  id: number;
  libelle: string;
  description?: string;
  prix_unitaire: number;
  est_actif: boolean;
  created_at?: string;
}

export interface ServiceDTO {
  libelle: string;
  description?: string;
  prix_unitaire: number;
  est_actif?: boolean;
}