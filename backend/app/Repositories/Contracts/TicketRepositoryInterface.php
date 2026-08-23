<?php

namespace App\Repositories\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface TicketRepositoryInterface extends BaseRepositoryInterface
{
    public function getForClient(int $clientId, ?string $statut = null): LengthAwarePaginator;

    public function getAllTickets(?string $statut = null, ?string $search = null): LengthAwarePaginator;

    public function generateUniqueCode(): string;
}
