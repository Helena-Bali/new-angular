import { TestBed } from '@angular/core/testing';

import { SdekService } from './sdek.service';

describe('SdekService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SdekService = TestBed.get(SdekService);
    expect(service).toBeTruthy();
  });
});
