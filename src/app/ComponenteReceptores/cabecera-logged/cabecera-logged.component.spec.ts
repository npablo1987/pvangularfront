import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabeceraLoggedComponent } from './cabecera-logged.component';

describe('CabeceraLoggedComponent', () => {
  let component: CabeceraLoggedComponent;
  let fixture: ComponentFixture<CabeceraLoggedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabeceraLoggedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabeceraLoggedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
