import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvEmploymentComponent } from './cv-employment.component';

describe('CvEmploymentComponent', () => {
  let component: CvEmploymentComponent;
  let fixture: ComponentFixture<CvEmploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvEmploymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvEmploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
