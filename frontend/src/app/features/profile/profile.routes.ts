// =============================================================================
// CeylonGo — Module 07: User Profile Feature Routes
// Architecture: Angular 21 Lazy-loaded Feature Routing
// =============================================================================

import { Routes } from '@angular/router';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    component: ProfilePageComponent,
    title: 'My Profile & Account Settings — CeylonGo',
  },
];
