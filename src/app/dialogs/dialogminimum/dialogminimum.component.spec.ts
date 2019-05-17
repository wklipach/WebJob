import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogminimumComponent } from './dialogminimum.component';

describe('DialogminimumComponent', () => {
  let component: DialogminimumComponent;
  let fixture: ComponentFixture<DialogminimumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogminimumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogminimumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
