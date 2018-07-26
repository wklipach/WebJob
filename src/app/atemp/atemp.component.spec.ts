import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtempComponent } from './atemp.component';

describe('AtempComponent', () => {
  let component: AtempComponent;
  let fixture: ComponentFixture<AtempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
