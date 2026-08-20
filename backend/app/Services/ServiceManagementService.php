<?php

namespace App\Services;

use App\DTOs\Service\CreateServiceDTO;
use App\DTOs\Service\UpdateServiceDTO;
use App\Models\Service;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

final readonly class ServiceManagementService
{
    public function __construct(
        private ServiceRepositoryInterface $serviceRepository
    ) {}

    public function getActiveCatalog(?string $search = null): Collection
    {
        return $this->serviceRepository->getActiveServices($search);
    }

    public function getAllServices(?string $search = null): Collection
    {
        return $this->serviceRepository->getAllServices($search);
    }

    public function getService(int $id): Service
    {
        return $this->serviceRepository->findOrFail($id);
    }

    public function createService(CreateServiceDTO $dto): Service
    {
        
        return $this->serviceRepository->create($dto->toArray());
    }

    public function updateService(int $id, UpdateServiceDTO $dto): Service
    {
        $service = $this->serviceRepository->findOrFail($id);

        
        return $this->serviceRepository->update($service, $dto->toArray());
    }

    public function toggleActive(int $id): Service
    {
        
        $service = $this->serviceRepository->findOrFail($id);

        
        return $this->serviceRepository->update($service, [
            'est_actif' => ! $service->est_actif,
        ]);
    }

    public function deleteService(int $id): bool
    {
        $service = $this->serviceRepository->findOrFail($id);

        return $this->serviceRepository->delete($service);
    }
}
