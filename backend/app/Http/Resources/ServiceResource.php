<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'libelle' => $this->libelle,
            'description' => $this->description,
            'prix_unitaire' => $this->prix_unitaire,
            'est_actif' => $this->est_actif,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
