<?php

namespace App\Http\Requests\Payment;

use App\DTOs\Payment\CreatePaymentDTO;
use App\Enums\PaymentMode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class CreatePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ticket_id' => ['required', 'integer', 'exists:tickets,id'],
            'montant' => ['required', 'numeric', 'min:0.01'],
            'mode_paiement' => ['nullable', new Enum(PaymentMode::class)],
        ];
    }

    public function toDTO(): CreatePaymentDTO
    {
        return new CreatePaymentDTO(
            ticket_id: (int) $this->input('ticket_id'),
            montant: (float) $this->input('montant'),
            mode_paiement: $this->filled('mode_paiement')
                ? PaymentMode::from($this->string('mode_paiement')->value())
                : PaymentMode::ESPECES,
        );
    }
}
