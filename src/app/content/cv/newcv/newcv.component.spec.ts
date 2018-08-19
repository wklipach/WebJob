import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcvComponent } from './newcv.component';

describe('NewcvComponent', () => {
  let component: NewcvComponent;
  let fixture: ComponentFixture<NewcvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewcvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewcvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
