import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearFichaIIComponent } from './crear-ficha-ii.component';

describe('CrearFichaIIComponent', () => {
  let component: CrearFichaIIComponent;
  let fixture: ComponentFixture<CrearFichaIIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearFichaIIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearFichaIIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
