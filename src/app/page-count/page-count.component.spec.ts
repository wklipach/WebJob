import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCountComponent } from './page-count.component';

describe('PageCountComponent', () => {
  let component: PageCountComponent;
  let fixture: ComponentFixture<PageCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
