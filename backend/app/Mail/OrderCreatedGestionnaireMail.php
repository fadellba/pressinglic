<?php

namespace App\Mail;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderCreatedGestionnaireMail extends Mailable implements ShouldQueue
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
                <h2>Nouvelle commande déposée !</h2>
                <p>Client : <strong>{$this->ticket->client->name}</strong> ({$this->ticket->client->email})</p>
                <p>Code Ticket : <strong>{$this->ticket->code_ticket}</strong></p>
                <p>Montant total : <strong>".number_format($this->ticket->montant_total, 2, ',', ' ').' FCFA</strong></p>
                <p>Veuillez prendre en charge ce ticket sur votre tableau de bord.</p>
            '
        );
    }
}
