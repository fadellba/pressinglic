<?php

namespace App\DTOs\Service;

use App\DTOs\BaseDTO;

final readonly class UpdateServiceDTO extends BaseDTO
{
    public function __construct(
        public ?string $libelle = null,
        public ?float $prix_unitaire = null,
        public ?string $description = null,
        public ?bool $est_actif = null,
    ) {}

    public function toArray(): array
    {
        return array_filter([
            'libelle' => $this->libelle,
            'prix_unitaire' => $this->prix_unitaire,
            'description' => $this->description,
            'est_actif' => $this->est_actif,
        ], fn ($val) => $val !== null);
    }
}
