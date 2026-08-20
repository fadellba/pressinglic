<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StatistiqueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class StatistiqueController extends Controller
{
    public function __construct(
        private readonly StatistiqueService $statistiqueService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $year = $request->query('year') ? (int) $request->query('year') : null;
        $stats = $this->statistiqueService->getDashboardStats($year);

        return response()->json([
            'data' => $stats,
        ]);
    }
}
