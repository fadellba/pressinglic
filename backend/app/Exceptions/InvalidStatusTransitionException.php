<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

final class InvalidStatusTransitionException extends Exception
{
    public function __construct(string $message = 'Transition de statut invalide.')
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
