<?php

namespace App\DTOs\Ticket;

use App\DTOs\BaseDTO;

final readonly class TicketItemDTO extends BaseDTO
{
    public function __construct(
        public int $service_id,
        public int $quantite,
    ) {}

    public function toArray(): array
    {
        return [
            'service_id' => $this->service_id,
            'quantite' => $this->quantite,
        ];
    }
}
