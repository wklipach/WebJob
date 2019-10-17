import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth-service.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {

  public idLang = 1;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.CallPageRules();
  }

  CallPageRules() {
    this.idLang = this.authService.getLangStorage();
  }

}
