<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code_ticket' => $this->code_ticket,
            'client_id' => $this->client_id,
            'client' => new UserResource($this->whenLoaded('client')),
            'statut' => $this->statut->value,
            'montant_total' => $this->montant_total,
            'est_paye' => $this->est_paye,
            'date_paiement' => $this->date_paiement?->toIso8601String(),
            'mode_paiement' => $this->mode_paiement?->value,
            'notes' => $this->notes,
            'items' => TicketItemResource::collection($this->whenLoaded('items')),
            'payment' => new PaymentResource($this->whenLoaded('payment')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
