import { TestBed } from '@angular/core/testing';

import { Operadora } from './operadora';

describe('Operadora', () => {
  let service: Operadora;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Operadora);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
