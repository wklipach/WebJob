import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth-service.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {


  public idLang = 1;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.CallPageRules();
  }

  CallPageRules() {
    this.idLang = this.authService.getLangStorage();
  }


}
