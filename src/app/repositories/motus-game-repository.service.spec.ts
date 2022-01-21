import { TestBed } from '@angular/core/testing';

import { MotusGameRepositoryService } from './motus-game-repository.service';

describe('MotusGameRepositoryService', () => {
  let service: MotusGameRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotusGameRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
