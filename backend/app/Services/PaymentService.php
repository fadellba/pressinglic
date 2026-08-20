<?php

namespace App\Services;

use App\DTOs\Payment\CreatePaymentDTO;
use App\Enums\TicketStatus;
use App\Exceptions\InvalidStatusTransitionException;
use App\Exceptions\TicketAlreadyPaidException;
use App\Models\Payment;
use App\Models\Ticket;
use App\Models\User;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use App\Repositories\Contracts\TicketRepositoryInterface;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

final readonly class PaymentService
{
    public function __construct(
        private PaymentRepositoryInterface $paymentRepository,
        private TicketRepositoryInterface $ticketRepository
    ) {}

    public function recordPayment(User $gestionnaire, CreatePaymentDTO $dto): Payment
    {
        return DB::transaction(function () use ($gestionnaire, $dto): Payment {
            
            $ticket = $this->ticketRepository->findOrFail($dto->ticket_id);

            if ($ticket->est_paye) {
                throw new TicketAlreadyPaidException;
            }

            if ($ticket->statut === TicketStatus::ANNULE) {
                throw new InvalidStatusTransitionException("Impossible d'encaisser un ticket annulé.");
            }

            if ($ticket->statut !== TicketStatus::PRET) {
                throw new InvalidStatusTransitionException("Le ticket doit être prêt avant d'être encaissé.");
            }

            if ((float) $dto->montant !== (float) $ticket->montant_total) {
                throw new InvalidStatusTransitionException(
                    "Le montant encaissé doit être égal au montant total du ticket ({$ticket->montant_total} FCFA)."
                );
            }

            
            $payment = $this->paymentRepository->create([
                'ticket_id' => $ticket->id,
                'montant' => $dto->montant,
                'date_paiement' => Carbon::now(),
                'mode_paiement' => $dto->mode_paiement->value,
                'enregistre_par_id' => $gestionnaire->id,
            ]);

            $this->ticketRepository->update($ticket, [
                'est_paye' => true,
                'date_paiement' => Carbon::now(),
                'mode_paiement' => $dto->mode_paiement->value,
            ]);

            return $payment->loadMissing(['ticket', 'enregistrePar']);
        });
    }
}
