import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionVacancyComponent } from './vacancy-description.component';

describe('DescriptionVacancyComponent', () => {
  let component: DescriptionVacancyComponent;
  let fixture: ComponentFixture<DescriptionVacancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptionVacancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionVacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
