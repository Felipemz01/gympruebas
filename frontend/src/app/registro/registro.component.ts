import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegistroService } from '../../app/services/registro.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // ya debería estar si estás navegando
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  mensaje: string = '';
  membresias: any[] = [];

  constructor(
    private fb: FormBuilder,
    private registroService: RegistroService,
    private http: HttpClient,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      contrasena: ['', Validators.required],
      membresia: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarMembresias();
  }

  cargarMembresias(): void {
    /*this.http.get<any[]>('http://localhost:8000/membresias/')*/
    this.http.get<any[]>(`${environment.apiUrl}/membresias/`)
      .subscribe({
        next: (data) => {
          this.membresias = data;
        },
        error: (err) => {
          console.error('Error al cargar membresías', err);
        }
      });
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const datos = {
        ...this.registroForm.value,
        id_membresia: this.registroForm.value.membresia
      };
      delete datos.membresia;

      this.registroService.registrar(datos).subscribe({
        next: res => this.mensaje = 'Registro exitoso ✅',
        error: err => this.mensaje = 'Error al registrar ❌'
      });
    }
  }

  volverAlLogin() {
    this.router.navigate(['/login']);
  }
}
