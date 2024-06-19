import { TestBed } from '@angular/core/testing';

import { BasraService } from './basra.service';

describe('BasraService', () => {
  let service: BasraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
