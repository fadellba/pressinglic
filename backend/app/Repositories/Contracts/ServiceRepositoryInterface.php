<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface ServiceRepositoryInterface extends BaseRepositoryInterface
{
    public function getActiveServices(?string $search = null): Collection;

    public function getAllServices(?string $search = null): Collection;
}
