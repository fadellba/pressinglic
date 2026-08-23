<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ticket\CreateTicketRequest;
use App\Http\Requests\Ticket\UpdateTicketStatusRequest;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use App\Services\PdfService;
use App\Services\TicketService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

final class TicketController extends Controller
{
    public function __construct(
        private readonly TicketService $ticketService,
        private readonly PdfService $pdfService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Ticket::class);

        $user = $request->user();
        $statut = $request->query('statut');
        $search = $request->query('search');

        $tickets = $user->isGestionnaire()
            ? $this->ticketService->getAllTickets($statut, $search)
            : $this->ticketService->getClientTickets($user->id, $statut);

        return response()->json([
            'data' => TicketResource::collection($tickets->items()),
            'meta' => [
                'current_page' => $tickets->currentPage(),
                'last_page' => $tickets->lastPage(),
                'per_page' => $tickets->perPage(),
                'total' => $tickets->total(),
            ],
        ]);
    }

    public function store(CreateTicketRequest $request): JsonResponse
    {
        $this->authorize('create', Ticket::class);

        $ticket = $this->ticketService->createTicket($request->user(), $request->toDTO());

        return (new TicketResource($ticket))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $ticket = $this->ticketService->getTicketDetails($id);

        $this->authorize('view', $ticket);

        return (new TicketResource($ticket))->response();
    }

    public function updateStatus(UpdateTicketStatusRequest $request, int $id): JsonResponse
    {
        $updatedTicket = $this->ticketService->updateStatus($id, $request->toDTO());

        return (new TicketResource($updatedTicket))->response();
    }

    public function cancel(Request $request, int $id): JsonResponse
    {
        $ticket = $this->ticketService->getTicketDetails($id);

        $this->authorize('cancel', $ticket);

        $cancelledTicket = $this->ticketService->cancelTicket($id);

        return (new TicketResource($cancelledTicket))->response();
    }

    public function downloadReceipt(Request $request, int $id): Response|JsonResponse
    {
        $ticket = $this->ticketService->getTicketDetails($id);

        $this->authorize('downloadReceipt', $ticket);

        $pdfBytes = $this->pdfService->generateReceiptPdf($ticket);

        return response($pdfBytes, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="recu_'.$ticket->code_ticket.'.pdf"',
        ]);
    }
}
