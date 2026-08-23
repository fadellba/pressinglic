<?php

namespace App\Http\Requests\Auth;

use App\DTOs\Auth\RegisterDTO;
use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:20'],
        ];
    }

    public function toDTO(): RegisterDTO
    {
        return new RegisterDTO(
            name: $this->string('name')->value(),
            email: $this->string('email')->value(),
            password: $this->string('password')->value(),
            phone: $this->filled('phone') ? $this->string('phone')->value() : null,
            role: UserRole::CLIENT
        );
    }
}
