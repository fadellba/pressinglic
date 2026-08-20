<?php

namespace App\Http\Requests\Service;

use App\DTOs\Service\UpdateServiceDTO;
use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'libelle' => ['nullable', 'string', 'max:255'],
            'prix_unitaire' => ['nullable', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'est_actif' => ['nullable', 'boolean'],
        ];
    }

    public function toDTO(): UpdateServiceDTO
    {
        return new UpdateServiceDTO(
            libelle: $this->has('libelle') ? $this->string('libelle')->value() : null,
            prix_unitaire: $this->has('prix_unitaire') ? (float) $this->input('prix_unitaire') : null,
            description: $this->has('description') ? $this->string('description')->value() : null,
            est_actif: $this->has('est_actif') ? $this->boolean('est_actif') : null,
        );
    }
}
