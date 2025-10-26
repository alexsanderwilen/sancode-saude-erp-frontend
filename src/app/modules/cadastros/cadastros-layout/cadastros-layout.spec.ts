import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrosLayout } from './cadastros-layout';

describe('CadastrosLayout', () => {
  let component: CadastrosLayout;
  let fixture: ComponentFixture<CadastrosLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrosLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrosLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

