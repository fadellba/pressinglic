<?php

namespace App\Mail;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderCreatedClientMail extends Mailable implements ShouldQueue
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
            subject: 'Nouvelle commande reçue - Ticket #'.$this->ticket->code_ticket,
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: "
                <h2>Bonjour {$this->ticket->client->name},</h2>
                <p>Votre commande de pressing a bien été enregistrée sous le code <strong>{$this->ticket->code_ticket}</strong>.</p>
                <p>Montant total : <strong>".number_format($this->ticket->montant_total, 2, ',', ' ')." FCFA</strong></p>
                <p>Vous pouvez suivre l'avancement de votre commande sur votre espace client.</p>
                <br>
                <p>Cordialement,<br>L'équipe Pressing LIC</p>
            "
        );
    }
}
