import { TestBed, inject } from '@angular/core/testing';

import { NewVacancyService } from './new-vacancy.service';

describe('NewVacancyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewVacancyService]
    });
  });

  it('should be created', inject([NewVacancyService], (service: NewVacancyService) => {
    expect(service).toBeTruthy();
  }));
});
