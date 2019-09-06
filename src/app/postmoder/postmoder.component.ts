import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../services/auth-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-postmoder',
  templateUrl: './postmoder.component.html',
  styleUrls: ['./postmoder.component.css']
})
export class PostmoderComponent implements OnInit {


  public bConnected: boolean = false;
  public id_user: number = -1;
  public bV = true;
  public bCV = false;


  constructor(
              public authService : AuthService,
              private router: Router) {


  }

  ngOnInit() {
    var Res =  this.authService.loginStorage();
    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;

      if (this.id_user  !== 1) {
          this.router.navigate(['/']);
      }


    if (!this.authService.getVorModerCV()) {
      this.bV = true;
      this.bCV = false;
    } else {
      this.bV = false;
      this.bCV = true;
    }



  }

  OnClickV() {
    this.authService.setVorModerCV(false);
    this.bV = true;
    this.bCV = false;
  }

  OnClickCV() {
    this.authService.setVorModerCV(true);
    this.bV = false;
    this.bCV = true;

  }

}
