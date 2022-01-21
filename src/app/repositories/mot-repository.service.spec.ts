import { TestBed } from '@angular/core/testing';

import { MotRepositoryService } from './mot-repository.service';

describe('MotRepositoryService', () => {
  let service: MotRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
