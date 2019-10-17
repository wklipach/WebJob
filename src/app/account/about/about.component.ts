import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../services/auth-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  public idLang = 1;

  constructor(public translate: TranslateService,
              public authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.CallPageAboutUs();
  }


  CallPageAboutUs() {
    this.idLang = this.authService.getLangStorage();
  }


}
