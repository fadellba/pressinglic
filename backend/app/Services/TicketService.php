<?php

namespace App\Services;

use App\DTOs\Ticket\CreateTicketDTO;
use App\DTOs\Ticket\UpdateTicketStatusDTO;
use App\Enums\TicketStatus;
use App\Enums\UserRole;
use App\Exceptions\InvalidStatusTransitionException;
use App\Exceptions\TicketNotPaidException;
use App\Mail\OrderCreatedClientMail;
use App\Mail\OrderCreatedGestionnaireMail;
use App\Mail\OrderReadyMail;
use App\Models\Ticket;
use App\Models\User;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use App\Repositories\Contracts\TicketRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

final readonly class TicketService
{
    private const int EMAIL_STAGGER_SECONDS = 14;

    public function __construct(
        private TicketRepositoryInterface $ticketRepository,
        private ServiceRepositoryInterface $serviceRepository,
        private UserRepositoryInterface $userRepository,
        private PdfService $pdfService
    ) {}

    public function createTicket(User $client, CreateTicketDTO $dto): Ticket
    {
        return DB::transaction(function () use ($client, $dto): Ticket {
            $codeTicket = $this->ticketRepository->generateUniqueCode();

            
            $ticket = $this->ticketRepository->create([
                'code_ticket' => $codeTicket,
                'client_id' => $client->id,
                'statut' => TicketStatus::RECU->value,
                'montant_total' => 0.0,
                'est_paye' => false,
                'notes' => $dto->notes,
            ]);

            $totalAmount = 0.0;

            foreach ($dto->items as $itemDto) {
                $service = $this->serviceRepository->findOrFail($itemDto->service_id);

                $sousTotal = $service->prix_unitaire * $itemDto->quantite;
                $totalAmount += $sousTotal;

                $ticket->items()->create([
                    'service_id' => $service->id,
                    'service_libelle' => $service->libelle,
                    'prix_unitaire' => $service->prix_unitaire,
                    'quantite' => $itemDto->quantite,
                    'sous_total' => $sousTotal,
                ]);
            }

            $ticket = $this->ticketRepository->update($ticket, [
                'montant_total' => $totalAmount,
            ]);

            $ticket->loadMissing(['client', 'items.service']);

            
            
            $this->queueOrderMails($ticket);

            return $ticket;
        });
    }

    private function queueOrderMails(Ticket $ticket): void
    {
        $recipients = [$ticket->client->email];
        foreach ($this->userRepository->findAllByRole(UserRole::GESTIONNAIRE) as $gestionnaire) {
            $recipients[] = $gestionnaire->email;
        }

        foreach ($recipients as $index => $recipient) {
            $mailable = $recipient === $ticket->client->email
                ? new OrderCreatedClientMail($ticket)
                : new OrderCreatedGestionnaireMail($ticket);

            Mail::to($recipient)->queue($mailable->delay(now()->addSeconds($index * self::EMAIL_STAGGER_SECONDS)));
        }
    }

    private const VALID_TRANSITIONS = [
        TicketStatus::RECU->value => [TicketStatus::EN_TRAITEMENT, TicketStatus::ANNULE],
        TicketStatus::EN_TRAITEMENT->value => [TicketStatus::PRET, TicketStatus::ANNULE],
        TicketStatus::PRET->value => [TicketStatus::RECUPERE],
        TicketStatus::RECUPERE->value => [],
        TicketStatus::ANNULE->value => [],
    ];

    public function updateStatus(int $ticketId, UpdateTicketStatusDTO $dto): Ticket
    {
        
        $ticket = $this->ticketRepository->findOrFail($ticketId);
        $newStatus = $dto->statut;

        if ($ticket->statut === $newStatus) {
            return $ticket->loadMissing(['client', 'items.service', 'payment']);
        }

        if (! in_array($newStatus, self::VALID_TRANSITIONS[$ticket->statut->value] ?? [], true)) {
            throw new InvalidStatusTransitionException(
                sprintf('Transition de statut impossible : "%s" vers "%s".', $ticket->statut->value, $newStatus->value)
            );
        }

        if ($newStatus === TicketStatus::RECUPERE && ! $ticket->est_paye) {
            throw new TicketNotPaidException;
        }

        $ticket = $this->ticketRepository->update($ticket, [
            'statut' => $newStatus->value,
        ]);

        $ticket->loadMissing(['client', 'items.service', 'payment']);

        
        
        
        if ($newStatus === TicketStatus::PRET) {
            Mail::to($ticket->client->email)
                ->queue((new OrderReadyMail($ticket))->delay(now()->addSeconds(self::EMAIL_STAGGER_SECONDS)));
        }

        return $ticket;
    }

    public function cancelTicket(int $ticketId): Ticket
    {
        
        $ticket = $this->ticketRepository->findOrFail($ticketId);

        if (in_array($ticket->statut, [TicketStatus::PRET, TicketStatus::RECUPERE], true)) {
            throw new InvalidStatusTransitionException("Impossible d'annuler un ticket prêt ou déjà récupéré.");
        }

        
        return $this->ticketRepository->update($ticket, [
            'statut' => TicketStatus::ANNULE->value,
        ]);
    }

    public function getClientTickets(int $clientId, ?string $statut = null): LengthAwarePaginator
    {
        return $this->ticketRepository->getForClient($clientId, $statut);
    }

    public function getAllTickets(?string $statut = null, ?string $search = null): LengthAwarePaginator
    {
        return $this->ticketRepository->getAllTickets($statut, $search);
    }

    public function getTicketDetails(int $id): Ticket
    {
        return $this->ticketRepository->findOrFail($id)->loadMissing(['client', 'items.service', 'payment']);
    }
}
