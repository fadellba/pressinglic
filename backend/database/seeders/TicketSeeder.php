<?php

namespace Database\Seeders;

use App\Enums\PaymentMode;
use App\Enums\TicketStatus;
use App\Models\Payment;
use App\Models\Service;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $client = User::where('email', 'client@pressing.com')->first();
        $gestionnaire = User::where('email', 'admin@pressing.com')->first();

        if (! $client || ! $gestionnaire) {
            return;
        }

        $lavage = Service::where('libelle', 'Lavage au kilo')->first();
        $repassage = Service::where('libelle', 'Repassage chemise')->first();
        $costume = Service::where('libelle', 'Nettoyage à sec costume')->first();

        if (! $lavage || ! $repassage || ! $costume) {
            return;
        }

        
        $t1 = Ticket::create([
            'code_ticket' => 'TCK-'.date('Ymd').'-0001',
            'client_id' => $client->id,
            'statut' => TicketStatus::RECU->value,
            'montant_total' => $lavage->prix_unitaire * 2 + $repassage->prix_unitaire * 3,
            'est_paye' => false,
            'notes' => 'Attention aux boutons de la chemise blanche.',
        ]);
        $t1->items()->create([
            'service_id' => $lavage->id,
            'service_libelle' => $lavage->libelle,
            'prix_unitaire' => $lavage->prix_unitaire,
            'quantite' => 2,
            'sous_total' => $lavage->prix_unitaire * 2,
        ]);
        $t1->items()->create([
            'service_id' => $repassage->id,
            'service_libelle' => $repassage->libelle,
            'prix_unitaire' => $repassage->prix_unitaire,
            'quantite' => 3,
            'sous_total' => $repassage->prix_unitaire * 3,
        ]);

        
        $t2 = Ticket::create([
            'code_ticket' => 'TCK-'.date('Ymd').'-0002',
            'client_id' => $client->id,
            'statut' => TicketStatus::PRET->value,
            'montant_total' => $costume->prix_unitaire,
            'est_paye' => true,
            'date_paiement' => Carbon::now(),
            'mode_paiement' => PaymentMode::ESPECES->value,
            'notes' => 'Costume bleu marine.',
        ]);
        $t2->items()->create([
            'service_id' => $costume->id,
            'service_libelle' => $costume->libelle,
            'prix_unitaire' => $costume->prix_unitaire,
            'quantite' => 1,
            'sous_total' => $costume->prix_unitaire,
        ]);
        Payment::create([
            'ticket_id' => $t2->id,
            'montant' => $costume->prix_unitaire,
            'date_paiement' => Carbon::now(),
            'mode_paiement' => PaymentMode::ESPECES->value,
            'enregistre_par_id' => $gestionnaire->id,
        ]);
    }
}
