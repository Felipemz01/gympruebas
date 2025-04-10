import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/login/';

  constructor(private http: HttpClient) {}

  login(email: string, contrasena: string) {
    return this.http.post(this.apiUrl, { email, contrasena });
  }
}
