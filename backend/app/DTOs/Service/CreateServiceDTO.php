<?php

namespace App\DTOs\Service;

use App\DTOs\BaseDTO;

final readonly class CreateServiceDTO extends BaseDTO
{
    public function __construct(
        public string $libelle,
        public float $prix_unitaire,
        public ?string $description = null,
        public bool $est_actif = true,
    ) {}

    public function toArray(): array
    {
        return [
            'libelle' => $this->libelle,
            'prix_unitaire' => $this->prix_unitaire,
            'description' => $this->description,
            'est_actif' => $this->est_actif,
        ];
    }
}
