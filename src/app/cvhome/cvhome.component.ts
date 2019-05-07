import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth-service.service';
import {dataCV} from '../class/CV';

@Component({
  selector: 'app-cvhome',
  templateUrl: './cvhome.component.html',
  styleUrls: ['./cvhome.component.css']
})
export class CvhomeComponent implements OnInit {

  //заголовок вакансий
  public sCV: string;
  private bConnected = false;
  private id_user = -1;
  private bEmployer = false;
  protected myDataCV: dataCV[];


  constructor(private authService: AuthService) { }

  ngOnInit() {

    var Res =  this.authService.loginStorage();
    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;
    this.bEmployer = Res.bEmployer;


  }

}
