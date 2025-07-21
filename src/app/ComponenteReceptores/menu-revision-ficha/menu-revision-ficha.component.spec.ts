import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuRevisionFichaComponent } from './menu-revision-ficha.component';

describe('MenuRevisionFichaComponent', () => {
  let component: MenuRevisionFichaComponent;
  let fixture: ComponentFixture<MenuRevisionFichaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuRevisionFichaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuRevisionFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
