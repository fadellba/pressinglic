import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/enums';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [roleGuard(UserRole.Gestionnaire)],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard-page.component').then((m) => m.DashboardPageComponent),
      },
      {
        path: 'tickets',
        loadComponent: () => import('./pages/tickets/tickets-page.component').then((m) => m.TicketsPageComponent),
      },
      {
        path: 'services',
        loadComponent: () => import('./pages/services/services-page.component').then((m) => m.ServicesPageComponent),
      },
    ],
  },
];