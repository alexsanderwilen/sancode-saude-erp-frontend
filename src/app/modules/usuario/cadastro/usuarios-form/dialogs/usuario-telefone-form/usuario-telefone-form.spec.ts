import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioTelefoneForm } from './usuario-telefone-form';

describe('UsuarioTelefoneForm', () => {
  let component: UsuarioTelefoneForm;
  let fixture: ComponentFixture<UsuarioTelefoneForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioTelefoneForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioTelefoneForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
