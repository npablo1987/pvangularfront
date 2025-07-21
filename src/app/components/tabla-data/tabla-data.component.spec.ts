import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDataComponent } from './tabla-data.component';

describe('TablaDataComponent', () => {
  let component: TablaDataComponent;
  let fixture: ComponentFixture<TablaDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
