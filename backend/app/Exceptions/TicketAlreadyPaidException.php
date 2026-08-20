<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

final class TicketAlreadyPaidException extends Exception
{
    public function __construct(string $message = 'Ce ticket a déjà été payé.')
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
