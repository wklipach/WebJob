import { TestBed } from '@angular/core/testing';

import { CvLanguageService } from './cv-language.service';

describe('CvLanguageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CvLanguageService = TestBed.get(CvLanguageService);
    expect(service).toBeTruthy();
  });
});
