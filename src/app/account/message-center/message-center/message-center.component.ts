import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../../services/auth-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.css']
})
export class MessageCenterComponent implements OnInit {

  constructor(public translate: TranslateService, private authService: AuthService, private router: Router) { }

  ngOnInit() {

    var Res =  this.authService.loginStorage();
    if (!Res.bConnected) {
      this.router.navigate(['/']);
    }

  }

}
