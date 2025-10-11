import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperadorasForm } from './operadoras-form';

describe('OperadorasForm', () => {
  let component: OperadorasForm;
  let fixture: ComponentFixture<OperadorasForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperadorasForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperadorasForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
