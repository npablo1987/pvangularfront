import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoFichaComponent } from './estado-ficha.component';

describe('EstadoFichaComponent', () => {
  let component: EstadoFichaComponent;
  let fixture: ComponentFixture<EstadoFichaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoFichaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
