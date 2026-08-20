export enum UserRole {
  Gestionnaire = 'gestionnaire',
  Client = 'client',
}

export enum TicketStatus {
  Recu = 'recu',
  EnTraitement = 'en_traitement',
  Pret = 'pret',
  Recupere = 'recupere',
  Annule = 'annule',
}

export enum PaymentMode {
  Especes = 'especes',
}

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  [TicketStatus.Recu]: 'Reçu',
  [TicketStatus.EnTraitement]: 'En cours de lavage',
  [TicketStatus.Pret]: 'Prêt à retirer',
  [TicketStatus.Recupere]: 'Récupéré',
  [TicketStatus.Annule]: 'Annulé',
};

export const TICKET_STATUS_ORDER: TicketStatus[] = [
  TicketStatus.Recu,
  TicketStatus.EnTraitement,
  TicketStatus.Pret,
  TicketStatus.Recupere,
  TicketStatus.Annule,
];

export const TICKET_STATUS_FILTER_LABELS: Record<'recu' | 'en_traitement' | 'pret', string> = {
  recu: 'Reçus',
  en_traitement: 'En cours',
  pret: 'Prêts',
};