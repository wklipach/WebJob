import { TestBed, inject } from '@angular/core/testing';

import { TableVacancyService } from './table-vacancy.service';

describe('TableVacancyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableVacancyService]
    });
  });

  it('should be created', inject([TableVacancyService], (service: TableVacancyService) => {
    expect(service).toBeTruthy();
  }));
});
