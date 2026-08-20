<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;

final class TicketPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function view(User $user, Ticket $ticket): bool
    {
        return $this->isOwner($user, $ticket);
    }

    public function cancel(User $user, Ticket $ticket): bool
    {
        return $this->isOwner($user, $ticket);
    }

    public function downloadReceipt(User $user, Ticket $ticket): bool
    {
        return $this->isOwner($user, $ticket);
    }

    private function isOwner(User $user, Ticket $ticket): bool
    {
        return $ticket->client_id === $user->id;
    }
}
