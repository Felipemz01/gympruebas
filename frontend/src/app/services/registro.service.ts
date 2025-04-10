import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Hace que este servicio esté disponible globalmente
})
export class RegistroService {
  private apiUrl = 'http://127.0.0.1:8000/api/miembros/';

  constructor(private http: HttpClient) {}

  registrar(datos: any): Observable<any> {
    return this.http.post(this.apiUrl, datos);
  }

}