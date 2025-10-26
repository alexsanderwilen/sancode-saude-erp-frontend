import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrosHome } from './cadastros-home';

describe('CadastrosHome', () => {
  let component: CadastrosHome;
  let fixture: ComponentFixture<CadastrosHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrosHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrosHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

