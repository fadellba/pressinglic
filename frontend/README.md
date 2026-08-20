# Frontend — SPA Pressing LIC (Angular 22)

Interface web de l'application de gestion de pressing : boutique en ligne, suivi de commandes et administration (dashboard, tickets, services).

## Stack

- **Angular 22** — composants standalone, signaux (`signal`/`computed`) et `@if`/`@for` (template control flow).
- **Tailwind CSS 3** — design system maison (thème « fresh »).
- **Chart.js 4** — graphiques du dashboard (barres + donut, filtre par mois).
- **RxJS** — appels API et gestion d'état réactif.

## Prérequis

- Node.js ≥ 20, npm
- Backend Laravel démarré sur `http://127.0.0.1:8000` (voir [backend/README.md](../backend/README.md))

## Installation & lancement

```bash
npm install
ng serve
```

L'application est disponible sur `http://localhost:4200` et communique directement avec l'API sur `http://localhost:8000/api` (configuré dans `src/environments/environment.ts`).

## Pages

| Route | Page | Rôle |
|---|---|---|
| `/` | Accueil (hero + catalogue + panier) | Public |
| `/boutique` | Boutique : recherche, filtres par catégorie, tri | Public |
| `/checkout` | Validation de commande (panier) | Public / Client |
| `/client/my-tickets` | Mes commandes : suivi, détail, reçu PDF, annulation | Client |
| `/admin/dashboard` | Statistiques : KPI + graphiques mensuels | Gestionnaire |
| `/admin/tickets` | Gestion des tickets : statuts, encaissement, reçus | Gestionnaire |
| `/admin/services` | Gestion du catalogue : CRUD, archivage | Gestionnaire |

## Build de production

```bash
ng build
```

La sortie est générée dans `dist/frontend` (fichiers optimisés, à servir par un serveur web statique). Le dossier `dist/` est régénéré à chaque build et ne doit pas être versionné.

## Qualité

- `npm run lint` — ESLint sur `src/**/*.ts` et `src/**/*.html`.