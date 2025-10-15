import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioEmailForm } from './usuario-email-form';

describe('UsuarioEmailForm', () => {
  let component: UsuarioEmailForm;
  let fixture: ComponentFixture<UsuarioEmailForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioEmailForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioEmailForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
