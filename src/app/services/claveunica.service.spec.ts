import { TestBed } from '@angular/core/testing';

import { ClaveunicaService } from './claveunica.service';

describe('ClaveunicaService', () => {
  let service: ClaveunicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaveunicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
