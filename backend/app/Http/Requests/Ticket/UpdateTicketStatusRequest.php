<?php

namespace App\Http\Requests\Ticket;

use App\DTOs\Ticket\UpdateTicketStatusDTO;
use App\Enums\TicketStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateTicketStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'statut' => ['required', new Enum(TicketStatus::class)],
        ];
    }

    public function toDTO(): UpdateTicketStatusDTO
    {
        return new UpdateTicketStatusDTO(
            statut: TicketStatus::from($this->string('statut')->value())
        );
    }
}
