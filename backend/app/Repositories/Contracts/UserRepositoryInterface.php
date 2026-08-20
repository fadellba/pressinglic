<?php

namespace App\Repositories\Contracts;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    public function findByEmail(string $email): ?User;

    public function findAllByRole(UserRole $role): Collection;
}
