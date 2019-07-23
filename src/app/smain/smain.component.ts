import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth-service.service';
import { Location } from "@angular/common";

@Component({
  selector: 'app-smain',
  templateUrl: './smain.component.html',
  styleUrls: ['./smain.component.css']
})
export class SmainComponent implements OnInit {

  private bConnected = false;
  private id_user = -1;
  public bEmployer = false;


  public bV = true;
  public bCV = false;


  constructor(private authService: AuthService) {

  }

  ngOnInit() {
    var Res =  this.authService.loginStorage();
    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;
    this.bEmployer = Res.bEmployer;

    if (!this.authService.getVorCV()) {
      this.bV = true;
      this.bCV = false;
    } else {
      this.bV = false;
      this.bCV = true;
    }



  }

  OnClickV() {
    this.authService.setVorCV(false);
    this.bV = true;
    this.bCV = false;
  }

  OnClickCV() {
    this.authService.setVorCV(true);
    this.bV = false;
    this.bCV = true;
  }

}
