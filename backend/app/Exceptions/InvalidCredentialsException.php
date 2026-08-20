<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

final class InvalidCredentialsException extends Exception
{
    public function __construct(string $message = 'Identifiants incorrects.')
    {
        parent::__construct($message, 401);
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'message' => $this->getMessage(),
        ], 401);
    }
}
