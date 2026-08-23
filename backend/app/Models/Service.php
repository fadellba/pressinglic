<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'libelle',
        'description',
        'prix_unitaire',
        'est_actif',
    ];

    protected function casts(): array
    {
        return [
            'prix_unitaire' => 'float',
            'est_actif' => 'boolean',
        ];
    }

    public function ticketItems(): HasMany
    {
        return $this->hasMany(TicketItem::class);
    }
}
