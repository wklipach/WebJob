import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdUnit2Component } from './ad-unit2.component';

describe('AdUnit2Component', () => {
  let component: AdUnit2Component;
  let fixture: ComponentFixture<AdUnit2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdUnit2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdUnit2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
