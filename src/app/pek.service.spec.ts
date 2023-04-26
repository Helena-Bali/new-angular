import { TestBed } from '@angular/core/testing';

import { PekService } from './pek.service';

describe('PekService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PekService = TestBed.get(PekService);
    expect(service).toBeTruthy();
  });
});
