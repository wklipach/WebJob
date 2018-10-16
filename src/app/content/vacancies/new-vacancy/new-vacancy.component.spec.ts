import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVacancyComponent } from './new-vacancy.component';

describe('NewVacancyComponent', () => {
  let component: NewVacancyComponent;
  let fixture: ComponentFixture<NewVacancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVacancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
