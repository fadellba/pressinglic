<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\CreatePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;

final class PaymentController extends Controller
{
    public function __construct(
        private readonly PaymentService $paymentService
    ) {}

    public function store(CreatePaymentRequest $request): JsonResponse
    {
        $payment = $this->paymentService->recordPayment($request->user(), $request->toDTO());

        return (new PaymentResource($payment))
            ->response()
            ->setStatusCode(201);
    }
}
