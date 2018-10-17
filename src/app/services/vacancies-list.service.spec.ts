import { TestBed, inject } from '@angular/core/testing';

import { VacanciesListService } from './vacancies-list.service';

describe('VacanciesListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VacanciesListService]
    });
  });

  it('should be created', inject([VacanciesListService], (service: VacanciesListService) => {
    expect(service).toBeTruthy();
  }));
});
