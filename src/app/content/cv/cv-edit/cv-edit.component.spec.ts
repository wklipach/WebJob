import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvEditComponent } from './cv-edit.component';

describe('CvEditComponent', () => {
  let component: CvEditComponent;
  let fixture: ComponentFixture<CvEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
