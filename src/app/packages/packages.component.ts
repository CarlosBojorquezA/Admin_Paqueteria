import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent {
  activeTab = 'ubicacion';
  
  // Para ubicación
  codigoRastreo = '';
  nuevaUbicacion = '';
  
  // Para estado
  idEnvio = '';
  nuevoEstado = '';
  estados = ['EN PROCESO', 'ENVIADO', 'EN ENTREGA A DOMICILIO', 'ENTREGADO'];
  
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

  actualizarUbicacion() {
    if (!this.codigoRastreo || !this.nuevaUbicacion) {
      this.showMessage('Por favor complete todos los campos.', 'error');
      return;
    }

    this.dataService.actualizarUbicacion(this.codigoRastreo, this.nuevaUbicacion).subscribe({
      next: (response) => {
        this.showMessage('Ubicación actualizada correctamente.', 'success');
        this.codigoRastreo = '';
        this.nuevaUbicacion = '';
      },
      error: (error) => {
        this.showMessage('Error al actualizar la ubicación.', 'error');
      }
    });
  }

  cambiarEstado() {
    if (!this.idEnvio || !this.nuevoEstado) {
      this.showMessage('Por favor complete todos los campos.', 'error');
      return;
    }

    this.dataService.cambiarEstadoPaquete(parseInt(this.idEnvio), this.nuevoEstado).subscribe({
      next: (response) => {
        this.showMessage('Estado actualizado correctamente.', 'success');
        this.idEnvio = '';
        this.nuevoEstado = '';
      },
      error: (error) => {
        this.showMessage('Error al actualizar el estado.', 'error');
      }
    });
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
}