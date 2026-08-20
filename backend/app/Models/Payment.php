<?php

namespace App\Models;

use App\Enums\PaymentMode;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'montant',
        'date_paiement',
        'mode_paiement',
        'enregistre_par_id',
    ];

    protected function casts(): array
    {
        return [
            'montant' => 'float',
            'date_paiement' => 'datetime',
            'mode_paiement' => PaymentMode::class,
        ];
    }

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function enregistrePar(): BelongsTo
    {
        return $this->belongsTo(User::class, 'enregistre_par_id');
    }
}
