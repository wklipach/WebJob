import { TestBed, inject } from '@angular/core/testing';

import { PreviousService } from './previous.service';

describe('PreviousService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PreviousService]
    });
  });

  it('should be created', inject([PreviousService], (service: PreviousService) => {
    expect(service).toBeTruthy();
  }));
});
