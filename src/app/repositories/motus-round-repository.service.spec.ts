import { TestBed } from '@angular/core/testing';

import { MotusRoundRepositoryService } from './motus-round-repository.service';

describe('MotusRoundRepositoryService', () => {
  let service: MotusRoundRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotusRoundRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
