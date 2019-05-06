import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmainComponent } from './smain.component';

describe('SmainComponent', () => {
  let component: SmainComponent;
  let fixture: ComponentFixture<SmainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
