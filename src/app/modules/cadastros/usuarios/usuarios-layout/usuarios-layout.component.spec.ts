import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosLayout } from './usuarios-layout';

describe('UsuariosLayout', () => {
  let component: UsuariosLayout;
  let fixture: ComponentFixture<UsuariosLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
