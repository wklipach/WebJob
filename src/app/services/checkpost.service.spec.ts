import { TestBed } from '@angular/core/testing';

import { CheckpostService } from './checkpost.service';

describe('CheckpostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckpostService = TestBed.get(CheckpostService);
    expect(service).toBeTruthy();
  });
});
