import { TestBed, inject } from '@angular/core/testing';

import { CvEditService } from './cv-edit.service';

describe('CvEditService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CvEditService]
    });
  });

  it('should be created', inject([CvEditService], (service: CvEditService) => {
    expect(service).toBeTruthy();
  }));
});
