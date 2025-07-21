import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisfichasComponent } from './misfichas.component';

describe('MisfichasComponent', () => {
  let component: MisfichasComponent;
  let fixture: ComponentFixture<MisfichasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisfichasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisfichasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
