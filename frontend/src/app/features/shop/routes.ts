import { Routes } from '@angular/router';
import { PublicLayoutComponent } from '../../layouts/public-layout/public-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home-page.component').then((m) => m.HomePageComponent),
      },
      {
        path: 'boutique',
        loadComponent: () => import('./pages/boutique/boutique-page.component').then((m) => m.BoutiquePageComponent),
      },
      {
        path: 'checkout',
        loadComponent: () => import('./pages/checkout/checkout-page.component').then((m) => m.CheckoutPageComponent),
      },
    ],
  },
];