import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichasaprobadasComponent } from './fichasaprobadas.component';

describe('FichasaprobadasComponent', () => {
  let component: FichasaprobadasComponent;
  let fixture: ComponentFixture<FichasaprobadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichasaprobadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichasaprobadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
