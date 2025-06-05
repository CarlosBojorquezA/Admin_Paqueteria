import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario = '';
  contrasena = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onLogin() {
    if (!this.usuario || !this.contrasena) {
      this.errorMessage = 'Por favor ingrese usuario y contraseña.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await this.authService.login(this.usuario, this.contrasena);
      this.isLoading = false;
      
      if (response.success) {
        console.log('Login exitoso, navegando a dashboard...');
        this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      this.isLoading = false;
      this.errorMessage = error.message || 'Error de autenticación';
      console.error('Error en login:', error);
    }
  }
}