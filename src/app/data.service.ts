import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/api'; // Cambiar por tu API

  constructor(private http: HttpClient) {}

  // Métodos para usuarios
  consultarUsuario(usuario: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${usuario}`);
  }

  modificarUsuario(usuario: string, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${usuario}`, datos);
  }

  eliminarUsuario(usuario: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${usuario}`);
  }

  // Métodos para paquetes
  actualizarUbicacion(codigoRastreo: string, ubicacion: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/paquetes/ubicacion`, {
      codigoRastreo,
      ubicacion
    });
  }

  cambiarEstadoPaquete(idEnvio: number, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/paquetes/estado`, {
      idEnvio,
      estado
    });
  }
}