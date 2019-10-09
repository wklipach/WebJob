import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsruComponent } from './about-usru.component';

describe('AboutUsruComponent', () => {
  let component: AboutUsruComponent;
  let fixture: ComponentFixture<AboutUsruComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutUsruComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutUsruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
