<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\StatistiqueController;
use App\Http\Controllers\Api\TicketController;
use Illuminate\Support\Facades\Route;

Route::pattern('id', '[0-9]+');


Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::get('/services', [ServiceController::class, 'index']);


Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    
    Route::get('/services/{id}', [ServiceController::class, 'show']);

    
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);
    Route::post('/tickets/{id}/cancel', [TicketController::class, 'cancel']);
    Route::get('/tickets/{id}/receipt', [TicketController::class, 'downloadReceipt']);

    
    Route::middleware('role:client')->group(function () {
        Route::post('/tickets', [TicketController::class, 'store']);
    });

    
    Route::middleware('role:gestionnaire')->group(function () {
        Route::post('/services', [ServiceController::class, 'store']);
        Route::put('/services/{id}', [ServiceController::class, 'update']);
        Route::patch('/services/{id}/toggle-active', [ServiceController::class, 'toggleActive']);
        Route::delete('/services/{id}', [ServiceController::class, 'destroy']);

        Route::patch('/tickets/{id}/status', [TicketController::class, 'updateStatus']);
        Route::post('/payments', [PaymentController::class, 'store']);
        Route::get('/stats', [StatistiqueController::class, 'index']);
    });
});
