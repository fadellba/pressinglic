<?php

namespace App\DTOs;

abstract readonly class BaseDTO
{
    abstract public function toArray(): array;
}
