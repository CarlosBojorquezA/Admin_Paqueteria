import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  usuario: string;
  nombre: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  login(usuario: string, contrasena: string): Promise<any> {
    // Simulación de login - reemplazar con llamada real al backend
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (usuario === 'admin' && contrasena === '123') {
          const user: User = { usuario: 'admin', nombre: 'Administrador', rol: 'Admin' };
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          resolve({ success: true, user });
        } else {
          reject({ message: 'Usuario o contraseña incorrectos' });
        }
      }, 1000);
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
