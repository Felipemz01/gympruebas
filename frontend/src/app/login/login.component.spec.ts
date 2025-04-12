import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule], 
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería navegar al dashboard si el login es exitoso', () => {
    component.username = 'correo@ejemplo.com';
    component.password = '123456';
    component.login();

    const req = httpMock.expectOne('http://localhost:8000/login/');
    expect(req.request.method).toBe('POST');
    req.flush({ miembro_id: '123', nombre: 'Juan Pérez' });

    expect(localStorage.getItem('userId')).toBe('123');
    expect(localStorage.getItem('userName')).toBe('Juan Pérez');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('debería mostrar error si el login falla', () => {
    component.username = 'correo@ejemplo.com';
    component.password = '123456';
    component.login();

    const req = httpMock.expectOne('http://localhost:8000/login/');
    req.flush({ error: 'Credenciales inválidas' }, { status: 401, statusText: 'Unauthorized' });

    expect(component.error).toBe('Credenciales inválidas');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });
});

