<?php

namespace App\Repositories\Eloquent;

use App\Models\Ticket;
use App\Repositories\Contracts\TicketRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class TicketRepository extends BaseRepository implements TicketRepositoryInterface
{
    public function __construct(Ticket $model)
    {
        parent::__construct($model);
    }

    public function getForClient(int $clientId, ?string $statut = null): LengthAwarePaginator
    {
        $query = $this->model->newQuery()
            ->with(['items.service', 'payment'])
            ->where('client_id', $clientId)
            ->latest();

        if ($statut !== null && trim($statut) !== '') {
            $query->where('statut', $statut);
        }

        return $query->paginate(50);
    }

    public function getAllTickets(?string $statut = null, ?string $search = null): LengthAwarePaginator
    {
        $query = $this->model->newQuery()
            ->with(['client', 'items.service', 'payment'])
            ->latest();

        if ($statut !== null && trim($statut) !== '') {
            $query->where('statut', $statut);
        }

        if ($search !== null && trim($search) !== '') {
            $term = '%'.trim($search).'%';
            $query->where(function ($q) use ($term) {
                $q->where('code_ticket', 'like', $term)
                    ->orWhereHas('client', function ($clientQuery) use ($term) {
                        $clientQuery->where('name', 'like', $term)
                            ->orWhere('email', 'like', $term);
                    });
            });
        }

        return $query->paginate(50);
    }

    public function generateUniqueCode(): string
    {
        do {
            $code = 'TCK-'.date('Ymd').'-'.strtoupper(Str::random(4));
        } while ($this->model->newQuery()->where('code_ticket', $code)->exists());

        return $code;
    }
}
