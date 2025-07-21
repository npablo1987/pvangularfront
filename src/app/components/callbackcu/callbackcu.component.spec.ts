import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackcuComponent } from './callbackcu.component';

describe('CallbackcuComponent', () => {
  let component: CallbackcuComponent;
  let fixture: ComponentFixture<CallbackcuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallbackcuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallbackcuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
