import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteReceptoresComponentComponent } from './componente-receptores-component.component';

describe('ComponenteReceptoresComponentComponent', () => {
  let component: ComponenteReceptoresComponentComponent;
  let fixture: ComponentFixture<ComponenteReceptoresComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteReceptoresComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteReceptoresComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
