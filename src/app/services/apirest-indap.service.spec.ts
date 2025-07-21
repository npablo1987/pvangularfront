import { TestBed } from '@angular/core/testing';

import { ApirestIndapService } from './apirest-indap.service';

describe('ApirestIndapService', () => {
  let service: ApirestIndapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApirestIndapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
