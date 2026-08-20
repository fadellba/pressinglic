<?php

namespace App\DTOs\Ticket;

use App\DTOs\BaseDTO;

final readonly class CreateTicketDTO extends BaseDTO
{
    
    public function __construct(
        public array $items,
        public ?string $notes = null,
    ) {}

    public function toArray(): array
    {
        return [
            'items' => array_map(fn (TicketItemDTO $item) => $item->toArray(), $this->items) // a expliquer,
            'notes' => $this->notes,
        ];
    }
}
