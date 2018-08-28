import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cvinfo2Component } from './cvinfo2.component';

describe('Cvinfo2Component', () => {
  let component: Cvinfo2Component;
  let fixture: ComponentFixture<Cvinfo2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cvinfo2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cvinfo2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
