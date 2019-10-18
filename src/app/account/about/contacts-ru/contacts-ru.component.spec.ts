import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsRuComponent } from './contacts-ru.component';

describe('ContactsRuComponent', () => {
  let component: ContactsRuComponent;
  let fixture: ComponentFixture<ContactsRuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsRuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsRuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
