<?php

namespace App\Repositories\Contracts;

interface StatistiqueRepositoryInterface
{
    public function countTicketsCreatedToday(): int;

    public function countTicketsRetrievedToday(): int;

    public function getRevenueToday(): float;

    public function getTicketsPerMonth(int $year): array;

    public function getRevenueByService(int $year): array;
}
