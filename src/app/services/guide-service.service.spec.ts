import { TestBed, inject } from '@angular/core/testing';

import { GuideService } from './guide-service.service';

describe('IndustryServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuideService]
    });
  });

  it('should be created', inject([GuideService], (service: GuideService) => {
    expect(service).toBeTruthy();
  }));
});
