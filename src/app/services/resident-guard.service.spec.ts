import { TestBed } from '@angular/core/testing';

import { ResidentGuardService } from './resident-guard.service';

describe('ResidentGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResidentGuardService = TestBed.get(ResidentGuardService);
    expect(service).toBeTruthy();
  });
});
