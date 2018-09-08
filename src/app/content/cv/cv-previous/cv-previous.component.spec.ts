import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvPreviousComponent } from './cv-previous.component';

describe('CvPreviousComponent', () => {
  let component: CvPreviousComponent;
  let fixture: ComponentFixture<CvPreviousComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvPreviousComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvPreviousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
