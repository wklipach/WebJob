import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountEmployerComponent } from './account-employer.component';

describe('Controlpanel2Component', () => {
  let component: AccountEmployerComponent;
  let fixture: ComponentFixture<AccountEmployerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountEmployerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
