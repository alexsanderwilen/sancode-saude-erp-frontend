import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleLayout } from './module-layout';

describe('ModuleLayout', () => {
  let component: ModuleLayout;
  let fixture: ComponentFixture<ModuleLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

