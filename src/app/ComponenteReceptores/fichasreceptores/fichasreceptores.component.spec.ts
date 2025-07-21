import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichasreceptoresComponent } from './fichasreceptores.component';

describe('FichasreceptoresComponent', () => {
  let component: FichasreceptoresComponent;
  let fixture: ComponentFixture<FichasreceptoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichasreceptoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichasreceptoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
