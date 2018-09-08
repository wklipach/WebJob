import { TestBed, inject } from '@angular/core/testing';

import { NewcvService } from './newcv.service';

describe('NewcvService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewcvService]
    });
  });

  it('should be created', inject([NewcvService], (service: NewcvService) => {
    expect(service).toBeTruthy();
  }));
});
