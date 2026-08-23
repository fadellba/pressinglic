import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { PublicLayoutComponent } from '../../layouts/public-layout/public-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'my-tickets', pathMatch: 'full' },
      {
        path: 'my-tickets',
        loadComponent: () => import('./pages/my-tickets/my-tickets-page.component').then((m) => m.MyTicketsPageComponent),
      },
    ],
  },
];