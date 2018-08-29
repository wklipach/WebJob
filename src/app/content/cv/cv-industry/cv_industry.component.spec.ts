import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cvinfo1Component } from './cv_industry.component';

describe('Cvinfo1Component', () => {
  let component: Cvinfo1Component;
  let fixture: ComponentFixture<Cvinfo1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cvinfo1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cvinfo1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
