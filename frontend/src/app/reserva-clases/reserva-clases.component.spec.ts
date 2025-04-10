import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaClasesComponent } from './reserva-clases.component';

describe('ReservaClasesComponent', () => {
  let component: ReservaClasesComponent;
  let fixture: ComponentFixture<ReservaClasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaClasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaClasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
