import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './core/layout/public-layout/public-layout.component';
import { HomePageComponent } from './features/home/pages/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
        title: 'CeylonGo — Discover Local. Feel at Home.',
      },
      {
        path: 'design-system',
        loadComponent: () =>
          import('./features/design-system/pages/design-system-page/design-system-page.component').then(
            (m) => m.DesignSystemPageComponent
          ),
        title: 'Design System & UI Components — CeylonGo',
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./features/profile/profile.routes').then((m) => m.PROFILE_ROUTES),
        title: 'My Profile & Account Settings — CeylonGo',
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
