import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvhomeComponent } from './cvhome.component';

describe('CvhomeComponent', () => {
  let component: CvhomeComponent;
  let fixture: ComponentFixture<CvhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvhomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
