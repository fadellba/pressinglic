<?php

namespace App\Services;

use App\Repositories\Contracts\StatistiqueRepositoryInterface;
use Illuminate\Support\Carbon;

final readonly class StatistiqueService
{
    public function __construct(
        private StatistiqueRepositoryInterface $statistiqueRepository
    ) {}

    public function getDashboardStats(?int $year = null): array
    {
        $targetYear = $year ?? (int) Carbon::now()->year;

        return [
            'tickets_created_today' => $this->statistiqueRepository->countTicketsCreatedToday(),
            'tickets_retrieved_today' => $this->statistiqueRepository->countTicketsRetrievedToday(),
            'revenue_today' => $this->statistiqueRepository->getRevenueToday(),
            'tickets_per_month' => $this->statistiqueRepository->getTicketsPerMonth($targetYear),
            'revenue_by_service' => $this->statistiqueRepository->getRevenueByService($targetYear),
        ];
    }
}
