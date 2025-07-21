import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabeceraNotLoggedInComponent } from './cabecera-not-logged-in.component';

describe('CabeceraNotLoggedInComponent', () => {
  let component: CabeceraNotLoggedInComponent;
  let fixture: ComponentFixture<CabeceraNotLoggedInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabeceraNotLoggedInComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabeceraNotLoggedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
