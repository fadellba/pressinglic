<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Reçu de Commande - {{ $ticket->code_ticket }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { color: #2563eb; margin: 0; font-size: 20px; }
        .info-box { width: 100%; margin-bottom: 20px; }
        .info-box td { vertical-align: top; width: 50%; }
        .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background-color: #f3f4f6; }
        .total { text-align: right; margin-top: 15px; font-size: 14px; font-weight: bold; }
        .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #666; }
        .badge { display: inline-block; padding: 3px 6px; border-radius: 4px; background: #e0e7ff; color: #3730a3; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>PRESSING LIC</h1>
        <p>Service de Nettoyage et Blanchisserie Professionnel</p>
    </div>

    <table class="info-box">
        <tr>
            <td>
                <strong>Information Ticket :</strong><br>
                Code Ticket : {{ $ticket->code_ticket }}<br>
                Date : {{ $ticket->created_at->format('d/m/Y H:i') }}<br>
                Statut : <span class="badge">{{ strtoupper($ticket->statut->value) }}</span>
            </td>
            <td>
                <strong>Information Client :</strong><br>
                Nom : {{ $ticket->client->name }}<br>
                Email : {{ $ticket->client->email }}<br>
                Téléphone : {{ $ticket->client->phone ?? 'N/A' }}
            </td>
        </tr>
    </table>

    <h3>Détail de la commande</h3>
    <table class="table">
        <thead>
            <tr>
                <th>Service</th>
                <th>Prix Unitaire</th>
                <th>Quantité</th>
                <th>Sous-Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($ticket->items as $item)
                <tr>
                    <td>{{ $item->service_libelle }}</td>
                    <td>{{ number_format($item->prix_unitaire, 2, ',', ' ') }} FCFA</td>
                    <td>{{ $item->quantite }}</td>
                    <td>{{ number_format($item->sous_total, 2, ',', ' ') }} FCFA</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total">
        Montant Total : {{ number_format($ticket->montant_total, 2, ',', ' ') }} FCFA<br>
        Statut Paiement : {{ $ticket->est_paye ? 'PAYÉ (' . strtoupper($ticket->mode_paiement?->value ?? 'espèces') . ')' : 'NON PAYÉ' }}
    </div>

    <div class="footer">
        <p>Merci pour votre confiance ! Merci de présenter ce reçu lors du retrait de vos articles.</p>
    </div>
</body>
</html>
