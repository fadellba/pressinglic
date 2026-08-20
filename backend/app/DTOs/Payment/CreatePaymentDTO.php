<?php

namespace App\DTOs\Payment;

use App\DTOs\BaseDTO;
use App\Enums\PaymentMode;

final readonly class CreatePaymentDTO extends BaseDTO
{
    public function __construct(
        public int $ticket_id,
        public float $montant,
        public PaymentMode $mode_paiement = PaymentMode::ESPECES,
    ) {}

    public function toArray(): array
    {
        return [
            'ticket_id' => $this->ticket_id,
            'montant' => $this->montant,
            'mode_paiement' => $this->mode_paiement->value,
        ];
    }
}
