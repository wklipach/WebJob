import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesRuComponent } from './rules-ru.component';

describe('RulesRuComponent', () => {
  let component: RulesRuComponent;
  let fixture: ComponentFixture<RulesRuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesRuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesRuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
