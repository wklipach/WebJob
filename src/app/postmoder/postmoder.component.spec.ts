import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostmoderComponent } from './postmoder.component';

describe('PostmoderComponent', () => {
  let component: PostmoderComponent;
  let fixture: ComponentFixture<PostmoderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostmoderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostmoderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
