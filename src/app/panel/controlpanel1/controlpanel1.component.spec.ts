import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Controlpanel1Component } from './controlpanel1.component';

describe('Controlpanel1Component', () => {
  let component: Controlpanel1Component;
  let fixture: ComponentFixture<Controlpanel1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Controlpanel1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Controlpanel1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
