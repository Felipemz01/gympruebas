import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // <-- Necesario para ngModel
import { CommonModule } from '@angular/common'; // <-- Necesario para *ngIf
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserva-clases',
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-clases.component.html',
  styleUrls: ['./reserva-clases.component.css']
})
export class ReservaClasesComponent implements OnInit {
  horarios: any[] = [];
  error = '';
  mensaje = '';
  userName: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Temporalmente omitimos la verificación de sesión
    this.userName = localStorage.getItem('userName') || '';
    this.cargarHorarios();
    this.cargarReservas();
    this.cargarReservas();
    this.http.get('http://localhost:8000/csrf-token/', { withCredentials: true }).subscribe(() => {
      console.log('Token CSRF recibido');
    });
  }

  cargarHorarios(): void {
    this.http.get<any[]>('http://localhost:8000/horarios/', { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.horarios = data;
        },
        error: (err) => {
          console.error(err);
          this.error = 'No se pudieron cargar los horarios.';
        }
      });
  }

  reservarClase(idHorario: number): void {
    const idMiembro = localStorage.getItem('userId');
    if (!idMiembro) {
      this.error = 'Debes iniciar sesión primero.';
      return;
    }

    const body = {
      id_miembro: Number(idMiembro),  // ✅ Forzamos a número
      id_horario: idHorario
    };

    this.http.post('http://localhost:8000/reservar/', body)
      .subscribe({
        next: (res: any) => {
          this.mensaje = res.mensaje;
          this.error = '';
          this.cargarHorarios();  // 🔄 Actualiza cupos
          this.cargarReservas(); // 🔄 Actualiza reservas del usuario
        },
        error: (err) => {
          this.error = err.error.error || 'Error al reservar clase';
          this.mensaje = '';
        }
      });
  }

  cerrarSesion(): void {
    this.http.post('http://localhost:8000/logout/', {}, { withCredentials: true }).subscribe({
      next: () => {
        localStorage.removeItem('miembro_id');  // si lo usas para controlar sesión
        window.location.href = '/login'; // redirige al login o landing
      },
      error: (err) => {
        console.error('Error al cerrar sesión', err);
      }
    });
  }

  formatearHora(hora: string): string {
    return hora?.slice(0, 5); // transforma "14:00:00" a "14:00"
  }

  filtroBusqueda: string = '';
filtroDia: string = '';
ordenAscendente: boolean = true;
columnaOrden: string = '';

diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

obtenerHorariosFiltrados(): any[] {
  let filtrados = [...this.horarios];

  // Filtro por día
  if (this.filtroDia) {
    filtrados = filtrados.filter(h => h.dia_semana === this.filtroDia);
  }

  // Filtro por búsqueda (clase o instructor)
  if (this.filtroBusqueda) {
    const query = this.filtroBusqueda.toLowerCase();
    filtrados = filtrados.filter(h =>
      h.clase.toLowerCase().includes(query) ||
      h.instructor.toLowerCase().includes(query) ||
      (h.apellido?.toLowerCase().includes(query) || '')
    );
  }

  // Ordenamiento
  if (this.columnaOrden) {
    filtrados.sort((a, b) => {
      const valA = a[this.columnaOrden];
      const valB = b[this.columnaOrden];
      if (valA < valB) return this.ordenAscendente ? -1 : 1;
      if (valA > valB) return this.ordenAscendente ? 1 : -1;
      return 0;
    });
  }

  return filtrados;
}

ordenarPor(columna: string): void {
  if (this.columnaOrden === columna) {
    this.ordenAscendente = !this.ordenAscendente;
  } else {
    this.columnaOrden = columna;
    this.ordenAscendente = true;
  }
}
obtenerIconoOrden(columna: string): string {
  if (this.columnaOrden === columna) {
    return this.ordenAscendente ? '↑' : '↓';
  }
  return '↕';
}


reservas: any[] = [];

cargarReservas(): void {
  const idMiembro = localStorage.getItem('userId');
  if (!idMiembro) return;

  this.http.get<any[]>(`http://localhost:8000/mis-reservas/?id_miembro=${idMiembro}`, { withCredentials: true })
    .subscribe({
      next: (data) => {
        this.reservas = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
}

getCookie(name: string): string {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : '';
}

cancelarReserva(reservaId: number): void {
  const csrfToken = this.getCookie('csrftoken');

  this.http.delete(`http://localhost:8000/cancelar-reserva/${reservaId}/`, {
    headers: {
      'X-CSRFToken': csrfToken
    },
    withCredentials: true
  }).subscribe({
    next: () => {
      this.mensaje = 'Reserva cancelada correctamente';
      this.cargarReservas();
      this.cargarHorarios(); // ✅ También actualiza los cupos
    },
    error: (err) => {
      this.error = err.error?.error || 'Error al cancelar la reserva';
    }
  });
}
  
}
