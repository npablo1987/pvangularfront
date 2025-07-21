import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearFichaIIIComponent } from './crear-ficha-iii.component';

describe('CrearFichaIIIComponent', () => {
  let component: CrearFichaIIIComponent;
  let fixture: ComponentFixture<CrearFichaIIIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearFichaIIIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearFichaIIIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
