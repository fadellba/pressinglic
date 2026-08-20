<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'service_id',
        'service_libelle',
        'prix_unitaire',
        'quantite',
        'sous_total',
    ];

    protected function casts(): array
    {
        return [
            'prix_unitaire' => 'float',
            'quantite' => 'integer',
            'sous_total' => 'float',
        ];
    }

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
