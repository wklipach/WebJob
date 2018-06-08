import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeagerTopComponent } from './heager-top.component';

describe('HeagerTopComponent', () => {
  let component: HeagerTopComponent;
  let fixture: ComponentFixture<HeagerTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeagerTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeagerTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
