<?php

namespace App\Enums;

enum TicketStatus: string
{
    case RECU = 'recu';
    case EN_TRAITEMENT = 'en_traitement';
    case PRET = 'pret';
    case RECUPERE = 'recupere';
    case ANNULE = 'annule';
}
