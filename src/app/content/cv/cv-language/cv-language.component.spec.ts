import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvLanguageComponent } from './cv-language.component';

describe('CvLanguageComponent', () => {
  let component: CvLanguageComponent;
  let fixture: ComponentFixture<CvLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
