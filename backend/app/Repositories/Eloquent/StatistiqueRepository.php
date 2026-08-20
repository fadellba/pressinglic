<?php

namespace App\Repositories\Eloquent;

use App\Enums\TicketStatus;
use App\Models\Payment;
use App\Models\Ticket;
use App\Repositories\Contracts\StatistiqueRepositoryInterface;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class StatistiqueRepository extends BaseRepository implements StatistiqueRepositoryInterface
{
    public function __construct(
        Ticket $model,
        private Payment $payment
    ) {
        parent::__construct($model);
    }

    public function countTicketsCreatedToday(): int
    {
        return $this->model->newQuery()
            ->whereDate('created_at', Carbon::today())
            ->count();
    }

    public function countTicketsRetrievedToday(): int
    {
        return $this->model->newQuery()
            ->where('statut', TicketStatus::RECUPERE)
            ->whereDate('updated_at', Carbon::today())
            ->count();
    }

    public function getRevenueToday(): float
    {
        return (float) $this->payment->newQuery()
            ->whereDate('date_paiement', Carbon::today())
            ->sum('montant');
    }

    public function getTicketsPerMonth(int $year): array
    {
        $monthExpr = $this->monthExpression('created_at');

        $rows = $this->model->newQuery()
            ->whereYear('created_at', $year)
            ->selectRaw("{$monthExpr} as month, count(*) as count")
            ->groupByRaw($monthExpr)
            ->orderByRaw($monthExpr)
            ->get();

        $monthlyCounts = [];
        foreach ($rows as $row) {
            $monthlyCounts[(int) $row->month] = (int) $row->count;
        }

        $result = [];
        for ($m = 1; $m <= 12; $m++) {
            $result[] = [
                'month' => $m,
                'count' => $monthlyCounts[$m] ?? 0,
            ];
        }

        return $result;
    }

    public function getRevenueByService(int $year): array
    {
        $monthExpr = $this->monthExpression('tickets.created_at');

        $rows = $this->model->newQuery()
            ->join('ticket_items', 'tickets.id', '=', 'ticket_items.ticket_id')
            ->where('tickets.est_paye', true)
            ->whereYear('tickets.created_at', $year)
            ->selectRaw("ticket_items.service_libelle as service_libelle, {$monthExpr} as month, sum(ticket_items.sous_total) as total")
            ->groupBy('ticket_items.service_libelle')
            ->groupByRaw($monthExpr)
            ->orderBy('ticket_items.service_libelle')
            ->orderByRaw($monthExpr)
            ->get();

        $monthlyByService = [];
        foreach ($rows as $row) {
            $monthlyByService[$row->service_libelle][(int) $row->month] = (float) $row->total;
        }

        $result = [];
        foreach ($monthlyByService as $libelle => $monthlyTotals) {
            $revenueByMonth = [];
            for ($m = 1; $m <= 12; $m++) {
                $revenueByMonth[] = [
                    'month' => $m,
                    'revenue' => round($monthlyTotals[$m] ?? 0, 2),
                ];
            }

            $result[] = [
                'service' => $libelle,
                'total' => round(array_sum($monthlyTotals), 2),
                'revenue_by_month' => $revenueByMonth,
            ];
        }

        return $result;
    }

    private function monthExpression(string $column): string
    {
        return DB::connection()->getDriverName() === 'pgsql'
            ? "to_char({$column}, 'MM')"
            : "strftime('%m', {$column})";
    }
}
