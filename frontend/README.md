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


« Explique-moi l'architecture générale du frontend de Pressinglic et le rôle de core, features, layouts et shared. 

Le frontend de Pressinglic utilise une architecture Angular moderne basée sur les composants standalone. L'application utilise également le lazy loading pour charger certaines fonctionnalités à la demande et le mode zoneless pour la détection des changements.

Le dossier core contient les éléments globaux et techniques de l'application, notamment l'authentification, les services API, les guards, les interceptors, le stockage et les modèles utilisés globalement.

Le dossier features contient les fonctionnalités métier de l'application. Chaque domaine fonctionnel possède donc son propre code.

Le dossier layouts définit la structure générale des différentes zones de l'application, par exemple la partie publique et la partie administration.

Enfin, shared contient les éléments réutilisables entre plusieurs fonctionnalités, comme des composants, directives ou pipes. »

Que se passe t-il techniquement depuis le demarage de l'application Angular jusqu'a l'affichage d'une page ?

« Angular commence par exécuter main.ts. Ce fichier importe bootstrapApplication, le composant racine App et la configuration globale appConfig. Ensuite, il appelle bootstrapApplication(App, appConfig). Angular démarre alors l'application avec App comme composant racine et applique la configuration définie dans appConfig. Cette configuration fournit notamment le Router et les autres services globaux. »

explique-moi précisément comment Angular arrive à afficher, par exemple, la page correspondant à /admin ?

Après :

bootstrapApplication(App, appConfig);

Angular démarre App.

Dans app.config.ts, on a notamment :

provideRouter(routes, ...)

Cela dit à Angular :

« Voici la configuration du système de routage de mon application. Utilise les routes définies dans app.routes.ts. »

Dans app.routes.ts, on trouve notamment une route de ce genre :

{
  path: 'admin',
  loadChildren: () =>
    import('./features/admin/routes').then(m => m.routes)
}

Donc Angular sait :

URL /admin
   ↓
route path: 'admin'
   ↓
charger les routes de features/admin

Ensuite, dans les routes d'administration, Angular trouve la page correspondant à la route demandée.

Le point important est ensuite RouterOutlet.

Dans app.html, on a :

<router-outlet></router-outlet>

RouterOutlet est l'emplacement dans lequel Angular va insérer le composant correspondant à la route actuelle.

Donc le mécanisme général est :

bootstrapApplication()
        ↓
App
        ↓
app.config.ts
        ↓
provideRouter(routes)
        ↓
app.routes.ts
        ↓
URL = /admin
        ↓
Angular cherche la route "admin"
        ↓
charge les routes admin
        ↓
trouve le composant correspondant
        ↓
RouterOutlet
        ↓
le composant est affiché
Le point à comprendre absolument

Le Router ne « dessine » pas la page.

Il décide :

« Avec cette URL, quel composant dois-je afficher ? »

Puis RouterOutlet indique :

« Affiche ce composant ici. »

C'est la relation essentielle :

Router = décide quoi afficher
RouterOutlet = indique où l'afficher

Quelle est la différence entre Router et RouterOutlet ?

Router détermine quel composant correspond à l'URL. RouterOutlet est le point d'insertion dans lequel Angular rend le composant correspondant à la route active.

Pourquoi, à ton avis, le projet a-t-il besoin de deux RouterOutlet différents au lieu d'un seul ?

« Il y a plusieurs RouterOutlet parce que l'application utilise des routes imbriquées. Le premier permet d'afficher le layout correspondant à la route principale, et le RouterOutlet présent dans ce layout permet ensuite d'afficher la page enfant correspondante. »

Pourquoi est-ce intéressant d'avoir AdminLayoutComponent comme composant parent de DashboardPageComponent au lieu d'afficher directement DashboardPageComponent ?

« Le layout permet de factoriser la structure commune à plusieurs pages. Les pages enfants sont injectées dans son RouterOutlet, ce qui évite de répéter la navigation et les éléments communs dans chaque page. »

@Component ne fournit pas du « carburant ». Il définit ce qu'est un composant Angular et décrit notamment son template, ses imports, son selector et son comportement.

Pourquoi Angular ne peut-il pas afficher directement DashboardPageComponent dans le premier RouterOutlet et se passer complètement du RouterOutlet de AdminLayoutComponent ?

DashboardPageComponent est une route enfant de AdminLayoutComponent. Le premier RouterOutlet rend le layout parent, puis le second permet d'y insérer la page enfant correspondant à la route active. Cela permet de conserver toute la structure commune de l'administration.

« On utilise des services pour respecter le principe SRP : le composant gère la présentation et les interactions avec l'utilisateur, tandis que les services encapsulent la logique métier et les accès aux données. Cela permet également de réutiliser cette logique et de faciliter les tests et la maintenance. »