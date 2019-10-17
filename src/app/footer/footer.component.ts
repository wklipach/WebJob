import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../services/auth-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}


