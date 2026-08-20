<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'service_id' => $this->service_id,
            'service_libelle' => $this->service_libelle,
            'prix_unitaire' => $this->prix_unitaire,
            'quantite' => $this->quantite,
            'sous_total' => $this->sous_total,
        ];
    }
}
