import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { PackagesComponent } from './packages/packages.component';
import { inject } from '@angular/core';
import { AuthService } from './auth.services';
import { Router } from '@angular/router';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';

// Guard para proteger rutas
export function authGuard() {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
}

// Guard para redirigir usuarios autenticados
export function loginGuard() {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false;
  } else {
    return true;
  }
}

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [loginGuard]
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'users', 
    component: UsersComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'packages', 
    component: PackagesComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'estadisticas', 
    component: EstadisticasComponent,
    canActivate: [authGuard]  // si quieres protegerla
  },
  { path: '**', redirectTo: '/login' }  // <-- esta siempre al final
];