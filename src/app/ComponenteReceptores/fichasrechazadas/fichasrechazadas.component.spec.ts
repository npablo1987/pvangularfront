import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichasrechazadasComponent } from './fichasrechazadas.component';

describe('FichasrechazadasComponent', () => {
  let component: FichasrechazadasComponent;
  let fixture: ComponentFixture<FichasrechazadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichasrechazadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichasrechazadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
