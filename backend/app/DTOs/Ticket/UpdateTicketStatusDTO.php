<?php

namespace App\DTOs\Ticket;

use App\DTOs\BaseDTO;
use App\Enums\TicketStatus;

final readonly class UpdateTicketStatusDTO extends BaseDTO
{
    public function __construct(
        public TicketStatus $statut,
    ) {}

    public function toArray(): array
    {
        return [
            'statut' => $this->statut->value,
        ];
    }
}
