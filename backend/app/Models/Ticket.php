<?php

namespace App\Models;

use App\Enums\PaymentMode;
use App\Enums\TicketStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'code_ticket',
        'client_id',
        'statut',
        'montant_total',
        'est_paye',
        'date_paiement',
        'mode_paiement',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'statut' => TicketStatus::class,
            'montant_total' => 'float',
            'est_paye' => 'boolean',
            'date_paiement' => 'datetime',
            'mode_paiement' => PaymentMode::class,
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(TicketItem::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
}
