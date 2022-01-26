import { TestBed } from '@angular/core/testing';

import { NeedLocalUserGuardService } from './need-local-user.guard.service';

describe('NeedLocalUser.GuardService', () => {
  let service: NeedLocalUserGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeedLocalUserGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
