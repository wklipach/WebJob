import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsEnComponent } from './contacts-en.component';

describe('ContactsEnComponent', () => {
  let component: ContactsEnComponent;
  let fixture: ComponentFixture<ContactsEnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsEnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsEnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
