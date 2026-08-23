# Backend — API REST Pressing LIC (Laravel 13 + Sanctum + PostgreSQL)

API REST de l'application de gestion de pressing : gestion des services, commandes (tickets), statuts, paiements, statistiques, reçus PDF et envois d'emails automatiques.

## Stack

- **Laravel 13** (PHP ≥ 8.3) — architecture en couches : `DTOs`, `Enums`, `Repositories`, `Services`, `Form Requests`, `Resources`.
- **Laravel Sanctum** — authentification par token (protection des routes selon le rôle).
- **PostgreSQL 17** — base de données `pressing_db`.
- **barryvdh/laravel-dompdf** — génération des reçus PDF.
- **Laravel Mail + Mailtrap** — emails de confirmation, notification gestionnaire et reçu PDF (file d'attente).

## Prérequis

- PHP ≥ 8.3, Composer 2
- PostgreSQL 17 (serveur local sur `127.0.0.1:5432`)

## Installation

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Configurer `.env` :

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=pressing_db
DB_USERNAME=postgres
DB_PASSWORD=postgres

MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=votre_mailtrap_username
MAIL_PASSWORD=votre_mailtrap_password
MAIL_FROM_ADDRESS="no-reply@pressing-lic.com"
MAIL_FROM_NAME="Pressing LIC"

QUEUE_CONNECTION=database
```

## Base de données & seeders

```bash
php artisan migrate --seed
```

Les seeders créent :
- le compte gestionnaire : `admin@pressing.com` / `Password123!` ;
- un compte client de démonstration : `client@pressing.com` / `Password123!` ;
- un catalogue de services (lavage, repassage, nettoyage à sec, couettes) et des tickets d'exemple.

## Lancement

```bash
php artisan serve        # API sur http://127.0.0.1:8000/api
```

Emails (file d'attente) :

```bash
php artisan queue:work
```

> Note Mailtrap : la sandbox limite l'envoi (~1 email / 10 s). Les mails sont espacés (`delay`) et relancés avec backoff en cas d'échec.

## Règles métier principales

- **Statuts** : `recu → en_traitement → pret → recupere`, avec `annule` possible depuis `recu` / `en_traitement`.
- **Paiement** : un ticket ne peut être payé qu'une seule fois (montant + date enregistrés).
- **Récupération** : le statut `recupere` est refusé tant que le ticket n'est pas payé.
- **Services inactifs** : exclus du catalogue client et refusés à la création d'une commande (`exists:services,id,est_actif,1`).
- **Emails automatiques** :
  - création de commande → confirmation client + notification gestionnaire ;
  - passage en `pret` → email au client avec le reçu PDF joint.

## Endpoints principaux

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/register` | Public | Inscription client |
| POST | `/api/login` | Public | Connexion |
| GET | `/api/services` | Public | Catalogue (services actifs) |
| POST | `/api/logout` | Auth | Déconnexion |
| GET | `/api/me` | Auth | Profil de l'utilisateur connecté |
| GET | `/api/services/{id}` | Auth | Détail d'un service |
| GET | `/api/tickets` | Auth | Liste des tickets (les siens / tous selon le rôle) |
| GET | `/api/tickets/{id}` | Auth | Détail d'un ticket |
| POST | `/api/tickets/{id}/cancel` | Auth | Annulation d'un ticket (avant « prêt ») |
| GET | `/api/tickets/{id}/receipt` | Auth | Téléchargement du reçu PDF |
| POST | `/api/tickets` | Client | Dépôt de commande (services + quantités) |
| POST | `/api/services` | Gestionnaire | Création d'un service |
| PUT | `/api/services/{id}` | Gestionnaire | Modification d'un service |
| PATCH | `/api/services/{id}/toggle-active` | Gestionnaire | Activer / désactiver (archiver) |
| DELETE | `/api/services/{id}` | Gestionnaire | Suppression d'un service |
| PATCH | `/api/tickets/{id}/status` | Gestionnaire | Faire évoluer le statut |
| POST | `/api/payments` | Gestionnaire | Encaissement d'un ticket |
| GET | `/api/stats` | Gestionnaire | Statistiques (KPI + graphiques) |

La documentation OpenAPI (l5-swagger) est disponible sur `/api/documentation`.

## Choix d'architecture assumés

- **Dénormalisation paiement** : `date_paiement` et `mode_paiement` sont dupliqués sur `tickets` (reflet pour lecture rapide) et dans `payments` (**source de vérité**). Les deux sont mis à jour dans la même transaction (`PaymentService::recordPayment`).
- **`Gate::before` global** : les gestionnaires disposent de toutes les capacités des policies ; les contrôleurs ne ré-appellent pas `authorize()` (les contrôles d'accès passent par le middleware `role:gestionnaire`).
- **Tokens Sanctum** : expiration 24 h, un seul token par utilisateur (les précédents sont purgés à chaque login), `throttle:10,1` sur `/login` et `/register`.
- **CORS** : restreint à `http://localhost:4200` (frontend dev). À étendre aux futurs domaines de production.
- **Emails** : les Mailable sont `ShouldQueue` avec `backoff()` ; aucun `sleep` bloquant dans les requêtes HTTP.