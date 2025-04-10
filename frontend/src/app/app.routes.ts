import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { ReservaClasesComponent } from './reserva-clases/reserva-clases.component';

export const routes: Routes = [
  { path: 'registro', component: RegistroComponent },
  { path: 'dashboard', component: ReservaClasesComponent },
  { path: 'login', component: LoginComponent },
  /*{ path: '', redirectTo: 'login', pathMatch: 'full' },*/
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }