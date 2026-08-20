<?php

namespace App\Http\Requests\Service;

use App\DTOs\Service\CreateServiceDTO;
use Illuminate\Foundation\Http\FormRequest;

class CreateServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'libelle' => ['required', 'string', 'max:255'],
            'prix_unitaire' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'est_actif' => ['nullable', 'boolean'],
        ];
    }

    public function toDTO(): CreateServiceDTO
    {
        return new CreateServiceDTO(
            libelle: $this->string('libelle')->value(),
            prix_unitaire: (float) $this->input('prix_unitaire'),
            description: $this->filled('description') ? $this->string('description')->value() : null,
            est_actif: $this->boolean('est_actif', true),
        );
    }
}
