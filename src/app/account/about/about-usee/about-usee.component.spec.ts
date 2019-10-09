import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUseeComponent } from './about-usee.component';

describe('AboutUseeComponent', () => {
  let component: AboutUseeComponent;
  let fixture: ComponentFixture<AboutUseeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutUseeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutUseeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
