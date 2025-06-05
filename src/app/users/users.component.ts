import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  activeTab = 'consultar';
  
  // Para consultar
  consultaUsuario = '';
  userInfo: any = null;
  
  // Para modificar
  modificarUsuario = '';
  modificarNombre = '';
  modificarRol = '';
  
  // Para eliminar
  eliminarUsuario = '';
  
  message = '';
  messageType = '';

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.clearMessage();
  }

  consultarUsuario() {
    if (!this.consultaUsuario) {
      this.showMessage('Por favor ingrese un usuario.', 'error');
      return;
    }

    this.dataService.consultarUsuario(this.consultaUsuario).subscribe({
      next: (user) => {
        this.userInfo = user;
        this.showMessage('Usuario encontrado.', 'success');
      },
      error: (error) => {
        this.showMessage('Usuario no encontrado.', 'error');
        this.userInfo = null;
      }
    });
  }

  modificarUsuarioAction() {
    if (!this.modificarUsuario || !this.modificarNombre || !this.modificarRol) {
      this.showMessage('Por favor complete todos los campos.', 'error');
      return;
    }

    const datos = {
      nombre: this.modificarNombre,
      rol: this.modificarRol
    };

    this.dataService.modificarUsuario(this.modificarUsuario, datos).subscribe({
      next: (response) => {
        this.showMessage('Usuario modificado correctamente.', 'success');
        this.resetModificarForm();
      },
      error: (error) => {
        this.showMessage('Error al modificar usuario.', 'error');
      }
    });
  }

  eliminarUsuarioAction() {
    if (!this.eliminarUsuario) {
      this.showMessage('Por favor ingrese un usuario.', 'error');
      return;
    }

    if (confirm(`¿Está seguro de eliminar el usuario "${this.eliminarUsuario}"?`)) {
      this.dataService.eliminarUsuario(this.eliminarUsuario).subscribe({
        next: (response) => {
          this.showMessage('Usuario eliminado correctamente.', 'success');
          this.eliminarUsuario = '';
        },
        error: (error) => {
          this.showMessage('Error al eliminar usuario.', 'error');
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  private showMessage(message: string, type: string) {
    this.message = message;
    this.messageType = type;
    setTimeout(() => this.clearMessage(), 5000);
  }

  private clearMessage() {
    this.message = '';
    this.messageType = '';
  }

  private resetModificarForm() {
    this.modificarUsuario = '';
    this.modificarNombre = '';
    this.modificarRol = '';
  }
}