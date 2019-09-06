import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostmoderCvComponent } from './postmoder-cv.component';

describe('PostmoderCvComponent', () => {
  let component: PostmoderCvComponent;
  let fixture: ComponentFixture<PostmoderCvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostmoderCvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostmoderCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
