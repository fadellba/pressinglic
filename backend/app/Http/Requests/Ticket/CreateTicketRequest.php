<?php

namespace App\Http\Requests\Ticket;

use App\DTOs\Ticket\CreateTicketDTO;
use App\DTOs\Ticket\TicketItemDTO;
use Illuminate\Foundation\Http\FormRequest;

class CreateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.service_id' => ['required', 'integer', 'distinct', 'exists:services,id,est_actif,1'],
            'items.*.quantite' => ['required', 'integer', 'min:1', 'max:20'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function toDTO(): CreateTicketDTO
    {
        $items = array_map(
            fn (array $item) => new TicketItemDTO(
                service_id: (int) $item['service_id'],
                quantite: (int) $item['quantite']
            ),
            $this->input('items', [])
        );

        return new CreateTicketDTO(
            items: $items,
            notes: $this->filled('notes') ? $this->string('notes')->value() : null
        );
    }
}
