<?php

namespace App\DTOs\Auth;

use App\DTOs\BaseDTO;

final readonly class LoginDTO extends BaseDTO
{
    public function __construct(
        public string $email,
        public string $password,
    ) {}

    public function toArray(): array
    {
        return [
            'email' => $this->email,
            'password' => $this->password,
        ];
    }
}
