import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  // Hace que este servicio esté disponible globalmente
})
export class RegistroService {
  /*private apiUrl = 'http://127.0.0.1:8000/api/miembros/';*/
  private apiUrl = `${environment.apiUrl}/api/miembros/`; // 🔄 Usamos la URL del entorno

  constructor(private http: HttpClient) {}

  registrar(datos: any): Observable<any> {
    return this.http.post(this.apiUrl, datos);
  }

}