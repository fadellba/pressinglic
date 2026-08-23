# Pressing LIC — Application de Gestion de Pressing / Laverie

Application web complète de gestion des commandes de nettoyage pour le **Pressing LIC** : dématérialisation du dépôt des commandes, suivi du traitement, encaissement et information automatique du client par email.

- **Backend** : API REST Laravel 13 + Sanctum + PostgreSQL 17 + DomPDF (reçus PDF) + Mailtrap (emails).
- **Frontend** : SPA Angular 22 (standalone components) + Tailwind CSS + Chart.js.

## Architecture

```
pressing/
├── backend/   → API REST Laravel (http://localhost:8000/api)
├── frontend/  → SPA Angular (http://localhost:4200)
└── README.md
```

Le frontend consomme l'API via l'URL `http://localhost:8000/api` (CORS activé sur le backend).

## Fonctionnalités

- **Catalogue & Boutique** (`/boutique`) : recherche, filtres par catégorie et tri des services ; page d'accueil marketing (`/`).
- **Commandes (tickets)** : dépôt en ligne multi-services avec quantités, cycle complet de statuts `reçu → en traitement → prêt → récupéré` (ou `annulé`), annulation avant « prêt ».
- **Paiements** : encaissement en espèces par le gestionnaire, paiement unique, récupération conditionnée au paiement.
- **Reçus PDF** : génération automatique (DomPDF) envoyée par email au passage en statut « prêt » et téléchargeable côté client et gestionnaire.
- **Statistiques** : KPI quotidiens (tickets créés/récupérés, recette) + graphiques Chart.js (tickets par mois, chiffre d'affaires par service avec filtre par mois).
- **Authentification & rôles** : inscription/connexion client, compte gestionnaire pré-créé, protection des routes par rôle (Sanctum).

## Comptes de démonstration (seeders)

| Rôle | Email | Mot de passe |
|---|---|---|
| Gestionnaire | `admin@pressing.com` | `Password123!` |
| Client | `client@pressing.com` | `Password123!` |

## Prérequis

- PHP ≥ 8.3, Composer 2
- PostgreSQL 17 (base `pressing_db`)
- Node.js ≥ 20, npm

## Installation & lancement

### 1. Backend

```bash
cd backend
composer install
cp .env.example .env   # puis configurer DB, MAIL_MAILER=mailtrap, MAIL_FROM_ADDRESS
php artisan key:generate
php artisan migrate --seed
php artisan serve          # http://127.0.0.1:8000
```

Lancer le worker de queue pour les emails (Mailtrap limite ~1 mail / 10 s) :

```bash
php artisan queue:work
```

### 2. Frontend

```bash
cd frontend
npm install
ng serve                 # http://localhost:4200
```

## Production

```bash
cd frontend
ng build                 # sortie dans frontend/dist → à servir par un serveur web (Nginx, etc.)
```

Le dossier `dist/` est généré automatiquement et ne doit pas être versionné.

## Documentation détaillée

- Backend : [README.md](./backend/README.md)
- Frontend : [README.md](./frontend/README.md)

## Stack technique

| Couche | Technologie |
|---|---|
| API | Laravel 13, Sanctum (token), Repository/Services/DTO |
| Base de données | PostgreSQL 17 |
| PDF | barryvdh/laravel-dompdf |
| Emails | Laravel Mail + Mailtrap (queue) |
| Frontend | Angular 22, Tailwind CSS, Chart.js |
| SGBD | PostgreSQL |