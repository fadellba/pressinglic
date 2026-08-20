<?php

namespace App\Services;

use App\Models\Ticket;
use Barryvdh\DomPDF\Facade\Pdf;

final readonly class PdfService
{
    public function generateReceiptPdf(Ticket $ticket): string
    {
        $ticket->loadMissing(['client', 'items.service', 'payment']);

        $pdf = Pdf::loadView('pdf.receipt', ['ticket' => $ticket]);

        return $pdf->output();
    }
}
