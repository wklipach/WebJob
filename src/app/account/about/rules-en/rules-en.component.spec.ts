import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesEnComponent } from './rules-en.component';

describe('RulesEnComponent', () => {
  let component: RulesEnComponent;
  let fixture: ComponentFixture<RulesEnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesEnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesEnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
