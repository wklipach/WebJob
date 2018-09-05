import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacancyDescriptionComponent } from './vacancy-description.component';

describe('DescriptionVacancyComponent', () => {
  let component: VacancyDescriptionComponent;
  let fixture: ComponentFixture<VacancyDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacancyDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacancyDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
