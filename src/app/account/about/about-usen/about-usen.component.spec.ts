import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsenComponent } from './about-usen.component';

describe('AboutUsenComponent', () => {
  let component: AboutUsenComponent;
  let fixture: ComponentFixture<AboutUsenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutUsenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutUsenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
