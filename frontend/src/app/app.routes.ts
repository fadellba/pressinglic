import { Routes } from '@angular/router';

/*
Ici, on définit la configuration des routes :
« Quelles URL existent et quel composant ou quelles routes doivent être chargés pour chacune ? »
*/

/*Routes : Le tableau contenant la liste de nos pages (URL et composants associés).
le Router analyse un URL par segments c-a-d
 angular fait du matching de routes segment par segment, de la route parente vers les routes enfants.*/
export const routes: Routes = [
  /*loadChildren permet le lazy loading. 
  Les routes d'administration ne sont pas chargées au démarrage de l'application ; 
  elles sont chargées uniquement lorsqu'elles deviennent nécessaires. 
  Cela évite de charger inutilement du code et améliore le chargement initial. 
  loadChildren: sert principalement à charger un ensemble de routes à la demande.
  loadComponent: sert à charger un composant à la demande.
  */
  { path: '', loadChildren: () => import('./features/shop/routes').then((m) => m.routes) },
  { path: 'client', loadChildren: () => import('./features/client/routes').then((m) => m.routes) },
  { path: 'admin', loadChildren: () => import('./features/admin/routes').then((m) => m.routes) },
  { path: '**', redirectTo: '' },
];