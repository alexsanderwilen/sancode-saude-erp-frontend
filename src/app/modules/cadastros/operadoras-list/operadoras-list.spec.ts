import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperadorasList } from './operadoras-list';

describe('OperadorasList', () => {
  let component: OperadorasList;
  let fixture: ComponentFixture<OperadorasList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperadorasList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperadorasList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
