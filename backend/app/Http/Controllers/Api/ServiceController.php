<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Service\CreateServiceRequest;
use App\Http\Requests\Service\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Services\ServiceManagementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ServiceController extends Controller
{
    public function __construct(
        private readonly ServiceManagementService $serviceManagementService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');

        $user = $request->bearerToken() !== null ? auth('sanctum')->user() : null;

        if ($user && $user->isGestionnaire() && $request->boolean('all', false)) {
            $services = $this->serviceManagementService->getAllServices($search);
        } else {
            $services = $this->serviceManagementService->getActiveCatalog($search);
        }

        return response()->json(['data' => ServiceResource::collection($services)]);
    }

    public function store(CreateServiceRequest $request): JsonResponse
    {
        $service = $this->serviceManagementService->createService($request->toDTO());

        return (new ServiceResource($service))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $service = $this->serviceManagementService->getService($id);

        return (new ServiceResource($service))->response();
    }

    public function update(UpdateServiceRequest $request, int $id): JsonResponse
    {
        $updatedService = $this->serviceManagementService->updateService($id, $request->toDTO());

        return (new ServiceResource($updatedService))->response();
    }

    public function toggleActive(Request $request, int $id): JsonResponse
    {
        $toggledService = $this->serviceManagementService->toggleActive($id);

        return (new ServiceResource($toggledService))->response();
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->serviceManagementService->deleteService($id);

        return response()->json(['message' => 'Service supprimé avec succès.']);
    }
}
