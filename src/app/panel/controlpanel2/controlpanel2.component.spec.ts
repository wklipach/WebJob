import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Controlpanel2Component } from './controlpanel2.component';

describe('Controlpanel2Component', () => {
  let component: Controlpanel2Component;
  let fixture: ComponentFixture<Controlpanel2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Controlpanel2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Controlpanel2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
