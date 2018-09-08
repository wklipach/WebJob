import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvScheduleComponent } from './cv-schedule.component';

describe('CvScheduleComponent', () => {
  let component: CvScheduleComponent;
  let fixture: ComponentFixture<CvScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
