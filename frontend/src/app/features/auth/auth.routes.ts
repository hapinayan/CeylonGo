import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Sign In — CeylonGo',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Create Your Account — CeylonGo',
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    title: 'Forgot Password — CeylonGo',
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: 'Reset Password — CeylonGo',
  },
  {
    path: 'sign-in',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'sign-up',
    redirectTo: 'register',
    pathMatch: 'full',
  },
];
