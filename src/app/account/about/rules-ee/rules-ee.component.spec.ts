import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesEeComponent } from './rules-ee.component';

describe('RulesEeComponent', () => {
  let component: RulesEeComponent;
  let fixture: ComponentFixture<RulesEeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesEeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesEeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
