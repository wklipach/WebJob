import { TestBed, inject } from '@angular/core/testing';

import { CvListService } from './cv-list.service';

describe('CvListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CvListService]
    });
  });

  it('should be created', inject([CvListService], (service: CvListService) => {
    expect(service).toBeTruthy();
  }));
});
