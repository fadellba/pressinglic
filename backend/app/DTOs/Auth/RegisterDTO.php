<?php

namespace App\DTOs\Auth;

use App\DTOs\BaseDTO;
use App\Enums\UserRole;

final readonly class RegisterDTO extends BaseDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public ?string $phone = null,
        public UserRole $role = UserRole::CLIENT
    ) {}

    public function toArray(): array
    {
        return array_filter([
            'name' => $this->name,
            'email' => $this->email,
            'password' => $this->password,
            'phone' => $this->phone,
            'role' => $this->role->value,
           
        ], fn ($val) => $val !== null) // a expliquer;
    }
}
