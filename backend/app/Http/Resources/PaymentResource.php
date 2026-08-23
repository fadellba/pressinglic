<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ticket_id' => $this->ticket_id,
            'montant' => $this->montant,
            'date_paiement' => $this->date_paiement?->toIso8601String(),
            'mode_paiement' => $this->mode_paiement?->value,
            'enregistre_par' => new UserResource($this->whenLoaded('enregistrePar')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];

        /*
        toIso8601String(): C'est une méthode de Carbon utilisée pour transformer une date en chaîne au format ISO 8601.
        Le format ISO 8601 est pratique pour une API parce qu'il indique clairement la date, l'heure et le décalage horaire.
        whenLoaded() est utilisé principalement dans les API Resources Laravel pour vérifier si une relation Eloquent a déjà été chargée.
        */
    }
}
