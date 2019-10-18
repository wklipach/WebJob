import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsEeComponent } from './contacts-ee.component';

describe('ContactsEeComponent', () => {
  let component: ContactsEeComponent;
  let fixture: ComponentFixture<ContactsEeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsEeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsEeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
