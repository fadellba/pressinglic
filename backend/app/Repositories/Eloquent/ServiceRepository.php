<?php

namespace App\Repositories\Eloquent;

use App\Models\Service;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ServiceRepository extends BaseRepository implements ServiceRepositoryInterface
{
    public function __construct(Service $model)
    {
        parent::__construct($model);
    }

    public function getActiveServices(?string $search = null): Collection
    {
        $query = $this->model->newQuery()->where('est_actif', true);

        if ($search !== null && trim($search) !== '') {
            $query->where('libelle', 'like', '%'.trim($search).'%');
        }

        return $query->get();
    }

    public function getAllServices(?string $search = null): Collection
    {
        $query = $this->model->newQuery();

        if ($search !== null && trim($search) !== '') {
            $query->where('libelle', 'like', '%'.trim($search).'%');
        }

        return $query->get();
    }
}
