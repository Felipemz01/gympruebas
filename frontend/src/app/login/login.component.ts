import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Necesario para ngModel
import { CommonModule } from '@angular/common'; // <-- Necesario para *ngIf
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  login(): void {
    const body = {
      email: this.username,
      contrasena: this.password
    };
  
    /*this.http.post('http://localhost:8000/login/', body, { withCredentials: true })*/
    this.http.post(`${environment.apiUrl}/login/`, body, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          // 👇 Guarda el ID del miembro en localStorage
          localStorage.setItem('userId', res.miembro_id);
      localStorage.setItem('userName', res.nombre);         // 👈 Guardamos el nombre
          // Redirige al dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = err.error?.error || 'Error al iniciar sesión.';
        }
      });
  }
  irARegistro(): void {
    this.router.navigate(['/registro']);
  }
}
