import { TestBed } from '@angular/core/testing';

import { SocialPerformanceService } from './social-performance.service';

describe('SocialPerformanceService', () => {
  let service: SocialPerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialPerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
