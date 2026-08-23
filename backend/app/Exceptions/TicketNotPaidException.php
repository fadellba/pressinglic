<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

final class TicketNotPaidException extends Exception
{
    public function __construct(string $message = "Un ticket ne peut pas passer au statut Récupéré s'il n'est pas payé.")
    {
        parent::__construct($message, 422);
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'message' => $this->getMessage(),
        ], 422);
    }
}
