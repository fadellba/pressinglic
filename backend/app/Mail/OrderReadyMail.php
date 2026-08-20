<?php

namespace App\Mail;

use App\Models\Ticket;
use App\Services\PdfService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderReadyMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Ticket $ticket
    ) {}

    public function backoff(): array
    {
        return [10, 30]; 
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Votre commande est prête ! - Ticket #'.$this->ticket->code_ticket,
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: "
                <h2>Bonne nouvelle {$this->ticket->client->name} !</h2>
                <p>Votre commande <strong>{$this->ticket->code_ticket}</strong> est prête à être récupérée au pressing.</p>
                <p>Vous trouverez ci-joint votre reçu de commande au format PDF.</p>
                <br>
                <p>À très bientôt,<br>L'équipe Pressing LIC</p>
            "
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromData(
                fn () => app(PdfService::class)->generateReceiptPdf($this->ticket),
                "recu_{$this->ticket->code_ticket}.pdf"
            )->withMime('application/pdf'),
        ];
    }
}