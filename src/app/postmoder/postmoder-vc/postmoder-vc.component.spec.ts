import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostmoderVcComponent } from './postmoder-vc.component';

describe('PostmoderVcComponent', () => {
  let component: PostmoderVcComponent;
  let fixture: ComponentFixture<PostmoderVcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostmoderVcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostmoderVcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
