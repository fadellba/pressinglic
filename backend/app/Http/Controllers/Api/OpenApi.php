<?php

namespace App\Http\Controllers\Api;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: 'Pressing LIC API',
    version: '1.0.0',
    description: "API REST de gestion de pressing / laverie. Permet l'inscription et l'authentification des clients, la gestion du catalogue de services, le dépôt et le suivi des commandes (tickets), l'enregistrement des paiements, la génération de reçus PDF et la consultation des statistiques du tableau de bord gestionnaire."
)]
#[OA\Server(
    url: '/api',
    description: 'Serveur API local'
)]
#[OA\SecurityScheme(
    securityScheme: 'bearerAuth',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: "Insérez votre jeton d'accès obtenu lors de la connexion (sans le préfixe 'Bearer ')."
)]





#[OA\Post(
    path: '/register',
    summary: 'Inscription client',
    description: "Permet aux nouveaux clients de créer un compte. Rôle par défaut : 'client'.",
    tags: ['Authentification'],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['name', 'email', 'password'],
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Jean Dupont'),
                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'jean@pressing.com'),
                new OA\Property(property: 'password', type: 'string', format: 'password', example: 'Password123!'),
                new OA\Property(property: 'phone', type: 'string', example: '+221 77 000 00 00'),
            ]
        )
    ),
    responses: [
        new OA\Response(response: 201, description: 'Client créé avec succès, token retourné'),
        new OA\Response(response: 422, description: 'Données de validation invalides'),
    ]
)]

#[OA\Post(
    path: '/login',
    summary: 'Connexion utilisateur',
    description: "Permet aux clients et gestionnaires de se connecter et d'obtenir un jeton d'accès Sanctum.",
    tags: ['Authentification'],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['email', 'password'],
            properties: [
                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'admin@pressing.com'),
                new OA\Property(property: 'password', type: 'string', format: 'password', example: 'Password123!'),
            ]
        )
    ),
    responses: [
        new OA\Response(response: 200, description: 'Connexion réussie avec token'),
        new OA\Response(response: 401, description: 'Identifiants incorrects'),
    ]
)]

#[OA\Post(
    path: '/logout',
    summary: 'Déconnexion',
    description: "Révoque le jeton d'accès actuel de l'utilisateur connecté.",
    tags: ['Authentification'],
    security: [['bearerAuth' => []]],
    responses: [
        new OA\Response(response: 200, description: 'Déconnexion réussie'),
        new OA\Response(response: 401, description: 'Non authentifié'),
    ]
)]

#[OA\Get(
    path: '/me',
    summary: 'Profil utilisateur connecté',
    description: "Retourne les informations du profil de l'utilisateur authentifié.",
    tags: ['Authentification'],
    security: [['bearerAuth' => []]],
    responses: [
        new OA\Response(response: 200, description: "Profil de l'utilisateur"),
        new OA\Response(response: 401, description: 'Non authentifié'),
    ]
)]





#[OA\Get(
    path: '/services',
    summary: 'Lister les services du catalogue',
    description: 'Retourne les services actifs. Le gestionnaire peut ajouter `?all=true` pour voir aussi les services inactifs. Filtrage possible via `?search=mot_clé`.',
    tags: ['Services'],
    parameters: [
        new OA\Parameter(name: 'search', in: 'query', required: false, description: 'Filtrer par libellé', schema: new OA\Schema(type: 'string')),
        new OA\Parameter(name: 'all', in: 'query', required: false, description: 'Inclure les services inactifs (gestionnaire uniquement)', schema: new OA\Schema(type: 'boolean')),
    ],
    responses: [
        new OA\Response(response: 200, description: 'Liste des services'),
    ]
)]

#[OA\Post(
    path: '/services',
    summary: 'Créer un service',
    description: 'Accès : Gestionnaire uniquement. Ajoute un nouveau service au catalogue.',
    tags: ['Services'],
    security: [['bearerAuth' => []]],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['libelle', 'prix_unitaire'],
            properties: [
                new OA\Property(property: 'libelle', type: 'string', example: 'Repassage chemise'),
                new OA\Property(property: 'prix_unitaire', type: 'number', format: 'float', example: 600.00),
                new OA\Property(property: 'description', type: 'string', example: 'Repassage soigné sur cintre'),
                new OA\Property(property: 'est_actif', type: 'boolean', example: true),
            ]
        )
    ),
    responses: [
        new OA\Response(response: 201, description: 'Service créé'),
        new OA\Response(response: 403, description: 'Action non autorisée'),
        new OA\Response(response: 422, description: 'Données invalides'),
    ]
)]

#[OA\Get(
    path: '/services/{id}',
    summary: "Détails d'un service",
    description: "Retourne les détails complets d'un service.",
    tags: ['Services'],
    security: [['bearerAuth' => []]],
    parameters: [
        new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
    ],
    responses: [
        new OA\Response(response: 200, description: 'Détails du service'),
        new OA\Response(response: 404, description: 'Service non trouvé'),
    ]
)]

#[OA\Put(
    path: '/services/{id}',
    summary: 'Modifier un service',
    description: "Accès : Gestionnaire uniquement. Permet de modifier le libellé, le prix, la description ou l'état actif.",
    tags: ['Services'],
    security: [['bearerAuth' => []]],
    parameters: [
        new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
    ],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'libelle', type: 'string', example: 'Repassage pantalon'),
                new OA\Property(property: 'prix_unitaire', type: 'number', format: 'float', example: 750.00),
                new OA\Property(property: 'description', type: 'string', example: 'Mise à jour description'),
                new OA\Property(property: 'est_actif', type: 'boolean', example: true),
            ]
        )
    ),
    responses: [
        new OA\Response(response: 200, description: 'Service mis à jour'),
        new OA\Response(response: 403, description: 'Action non autorisée'),
    ]
)]

#[OA\Patch(
    path: '/services/{id}/toggle-active',
    summary: 'Activer / Désactiver un service',
    description: "Accès : Gestionnaire uniquement. Inverse l'état actif/inactif du service (archivage).",
    tags: ['Services'],
    security: [['bearerAuth' => []]],
    parameters: [
        new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
    ],
    responses: [
        new OA\Response(response: 200, description: 'État du service basculé'),
        new OA\Response(response: 403, description: 'Action non autorisée'),
    ]
)]

#[OA\Delete(
    path: '/services/{id}',
    summary: 'Supprimer un service',
    description: 'Accès : Gestionnaire uniquement. Supprime définitivement un service du catalogue.',
    tags: ['Services'],
    security: [['bearerAuth' => []]],
    parameters: [
        new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
    ],
    responses: [
        new OA\Response(response: 200, description: 'Service supprimé'),
        new OA\Response(response: 403, description: 'Action non autorisée'),
    ]
)]





#[OA\Get(
    path: '/tickets',
    summary: 'Lister les tickets / commandes',
    description: 'Client : retourne ses propres tickets. Gestionnaire : retourne tous les tickets avec pagination. Filtrage possible par `?statut=recu` et `?search=code_ou_client`.',
    tags: ['Tickets'],
    security: [['bearerAuth' => []]],
    parameters: [
        new OA\Parameter(name: 'statut', in: 'query', required: false, description: 'Filtrer par statut (recu, en_traitement, pret, recupere, annule)', schema: new OA\Schema(type: 'string')),
        new OA\Parameter(name: 'search', in: 'query', required: false, description: 'Recherche par code ticket ou nom/email du client', schema: new OA\Schema(type: 'string')),
    ],
    responses: [
        new OA\Response(response: 200, description: 'Liste des tickets'),
        new OA\Response(response: 401, description: 'Non authentifié'),
    ]
)]

#[OA\Post(
    path: '/tickets',
    summary: 'Créer un ticket (dépôt de commande)',
    description: 'Accès : Tout utilisateur connecté. Crée un ticket avec les articles choisis. Un code unique est généré automatiquement. Un email de confirmation est envoyé au client et un email de notification au gestionnaire.',
    tags: ['Tickets'],
    security: [['bearerAuth' => []]],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['items'],
            properties: [
                new OA\Property(
                    property: 'items',
                    type: 'array',
                    items: new OA\Items(
                        required: ['service_id', 'quantite'],
                        properties: [
                            new OA\Property(property: 'service_id', type: 'integer', example: 1),
                            new OA\Property(property: 'quantite', type: 'integer', example: 2),
                        ]
                    )
                ),
                new OA\Property(property: 'notes', type: 'string', example: 'Attention aux boutons de la chemise blanche'),
            ]
        )
    ),
    responses: [
        new OA\Response(response: 201, description: 'Ticket créé avec succès'),
        new OA\Response(response: 422, description: 'Données invalides (service inexistant ou inactif)'),
    ]
)]

#[OA\Get(
    path: '/tickets/{id}',
    summary: "Détails d'un ticket",
    description: "Retourne les détails complets d'un ticket avec ses articles, le client et le paiement associé. Les clients ne peuvent voir que leurs propres tickets.",
    tags: ['Tickets'],
    security: [['bearerAuth' => []]],
    parameters: [
        new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
    ],
    responses: [
        new OA\Response(response: 200, description: 'Détails du ticket'),
        new OA\Response(response: 403, description: 'Accès non autorisé'),
        new OA\Response(response: 404, description: 'Ticket non trouvé'),
    ]
)]

#[OA\Patch(
    path: '/tickets/{id}/status',
    summary: "Modifier le statut d'un ticket",
    description: "Accès : Gestionnaire uniquement. Permet de faire évoluer le statut du ticket (recu → en_traitement → pret → recupere). Règle métier : le statut 'recupere' est interdit si le ticket n'est pas payé.",
    tags: ['Tickets'],
    security: [['bearerAuth' => []]],
    parameters: [
        new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
    ],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['statut'],
            properties: [
                new OA\Property(property: 'statut', type: 'string', enum: ['recu', 'en_traitement', 'pret', 'recupere', 'annule'], example: 'en_traitement'),
            ]
        )
    ),
    responses: [
        new OA\Response(response: 200, description: 'Statut mis à jour'),
        new OA\Response(response: 403, description: 'Action non autorisée'),
        new OA\Response(response: 422, description: 'Transition de statut invalide ou ticket non payé'),
    ]
)]

#[OA\Post(
    path: '/tickets/{id}/cancel',
    summary: 'Annuler un ticket',
    description: "Client ou Gestionnaire. Impossible d'annuler un ticket au statut 'pret' ou 'recupere'. Le client ne peut annuler que ses propres tickets.",
    tags: ['Tickets'],
    security: [['bearerAuth' => []]],
    parameters: [
        new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
    ],
    responses: [
        new OA\Response(response: 200, description: 'Ticket annulé'),
        new OA\Response(response: 403, description: 'Accès non autorisé'),
        new OA\Response(response: 422, description: 'Annulation impossible (ticket prêt ou récupéré)'),
    ]
)]

#[OA\Get(
    path: '/tickets/{id}/receipt',
    summary: "Télécharger le reçu PDF d'un ticket",
    description: 'Génère et retourne le reçu de commande au format PDF. Les clients ne peuvent télécharger que le reçu de leurs propres tickets.',
    tags: ['Tickets'],
    security: [['bearerAuth' => []]],
    parameters: [
        new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
    ],
    responses: [
        new OA\Response(response: 200, description: 'Fichier PDF du reçu', content: new OA\MediaType(mediaType: 'application/pdf')),
        new OA\Response(response: 403, description: 'Accès non autorisé'),
        new OA\Response(response: 404, description: 'Ticket non trouvé'),
    ]
)]





#[OA\Post(
    path: '/payments',
    summary: 'Enregistrer un paiement',
    description: "Accès : Gestionnaire uniquement. Enregistre le paiement en espèces ou par carte pour un ticket. Met automatiquement à jour l'état `est_paye` du ticket. Empêche le double paiement.",
    tags: ['Paiements'],
    security: [['bearerAuth' => []]],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['ticket_id', 'montant'],
            properties: [
                new OA\Property(property: 'ticket_id', type: 'integer', example: 1),
                new OA\Property(property: 'montant', type: 'number', format: 'float', example: 3000.00),
                new OA\Property(property: 'mode_paiement', type: 'string', enum: ['especes', 'carte'], example: 'especes'),
            ]
        )
    ),
    responses: [
        new OA\Response(response: 201, description: 'Paiement enregistré'),
        new OA\Response(response: 403, description: 'Action non autorisée'),
        new OA\Response(response: 422, description: 'Ticket déjà payé ou données invalides'),
    ]
)]





#[OA\Get(
    path: '/stats',
    summary: 'Statistiques du tableau de bord',
    description: "Accès : Gestionnaire uniquement. Retourne les compteurs journaliers (tickets créés, tickets récupérés, recette du jour), le nombre de tickets par mois et le chiffre d'affaires par service, détaillé mois par mois. Filtrage par année via `?year=2026`.",
    tags: ['Statistiques'],
    security: [['bearerAuth' => []]],
    parameters: [
        new OA\Parameter(name: 'year', in: 'query', required: false, description: 'Année cible pour les graphiques (défaut : année en cours)', schema: new OA\Schema(type: 'integer', example: 2026)),
    ],
    responses: [
        new OA\Response(
            response: 200,
            description: 'Données statistiques du tableau de bord',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'tickets_created_today', type: 'integer', description: 'Nombre de tickets créés le jour même', example: 3),
                    new OA\Property(property: 'tickets_retrieved_today', type: 'integer', description: 'Nombre de tickets récupérés le jour même', example: 1),
                    new OA\Property(property: 'revenue_today', type: 'number', format: 'float', description: 'Recette journalière (somme des paiements du jour)', example: 4800),
                    new OA\Property(
                        property: 'tickets_per_month',
                        type: 'array',
                        description: 'Tickets créés par mois (12 mois, 1 = janvier)',
                        items: new OA\Items(
                            type: 'object',
                            required: ['month', 'count'],
                            properties: [
                                new OA\Property(property: 'month', type: 'integer', example: 1),
                                new OA\Property(property: 'count', type: 'integer', example: 0),
                            ]
                        )
                    ),
                    new OA\Property(
                        property: 'revenue_by_service',
                        type: 'array',
                        description: "Chiffre d'affaires par service, détaillé mois par mois (12 mois, 1 = janvier)",
                        items: new OA\Items(
                            type: 'object',
                            required: ['service', 'total', 'revenue_by_month'],
                            properties: [
                                new OA\Property(property: 'service', type: 'string', example: 'Lavage au kilo'),
                                new OA\Property(property: 'total', type: 'number', format: 'float', description: "Chiffre d'affaires total du service sur l'année", example: 4800),
                                new OA\Property(
                                    property: 'revenue_by_month',
                                    type: 'array',
                                    items: new OA\Items(
                                        type: 'object',
                                        required: ['month', 'revenue'],
                                        properties: [
                                            new OA\Property(property: 'month', type: 'integer', example: 1),
                                            new OA\Property(property: 'revenue', type: 'number', format: 'float', example: 0),
                                        ]
                                    )
                                ),
                            ]
                        )
                    ),
                ]
            )
        ),
        new OA\Response(response: 403, description: 'Accès non autorisé'),
    ]
)]

final class OpenApi {}
