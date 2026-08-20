import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./features/shop/routes').then((m) => m.routes) },
  { path: 'client', loadChildren: () => import('./features/client/routes').then((m) => m.routes) },
  { path: 'admin', loadChildren: () => import('./features/admin/routes').then((m) => m.routes) },
  { path: '**', redirectTo: '' },
];