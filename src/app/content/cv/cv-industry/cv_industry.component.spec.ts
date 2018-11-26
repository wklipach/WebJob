import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvIndustryComponent } from './cv_industry.component';

describe('CvIndustryComponent', () => {
  let component: CvIndustryComponent;
  let fixture: ComponentFixture<CvIndustryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvIndustryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
