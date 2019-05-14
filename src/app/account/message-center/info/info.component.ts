import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../services/auth-service.service';
import {Router} from '@angular/router';
import {LetterService} from '../../../services/letter.service';
import {InfoService} from '../../../services/info.service';
import {Letter} from '../../../class/Letter';
import {Info} from '../../../class/Info';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  private bConnected = false;
  protected id_user = -1;
  private bEmployer = false;
  protected myDataInfo: any;
  private sbscTableInfo: Subscription;
  private infoSubscription: Subscription;

  constructor(private authService: AuthService, private httpLetter: LetterService, private router: Router) {
    var Res =  this.authService.loginStorage();
    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;
    this.bEmployer = Res.bEmployer;
    this.myDataInfo = [];
  }

  ngOnInit() {
    return this.sbscTableInfo = this.httpLetter.getListInfo(this.id_user).subscribe(
      (data: any) => {
        this.myDataInfo = [];
        this.myDataInfo = data;
        console.log('this.myDataInfo',this.myDataInfo);
      });
  }

  ngOnDestroy() {

    if (typeof this.sbscTableInfo !== 'undefined') {
      this.sbscTableInfo.unsubscribe();
    }

    if (typeof this.infoSubscription !== 'undefined') {
      this.infoSubscription.unsubscribe();
    }

  }

  curInfoClick(Iid: number, $event) {

    console.log('нажали строку',Iid);

    let info: Info = this.myDataInfo.find(curInfo => curInfo.id===Iid);
    if (typeof info !== 'undefined') {
          //заодно закидываем идентификатор Info в хранилище
         window.localStorage.setItem('_infoid', JSON.stringify(Iid));
         this.router.navigate(['/info_page']);
    }
  }



}
