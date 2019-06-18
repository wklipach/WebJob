import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../../services/auth-service.service';
import {LetterService} from '../../../../services/letter.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Info} from '../../../../class/Info';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-info-container',
  templateUrl: './info-container.component.html',
  styleUrls: ['./info-container.component.css']
})
export class InfoContainerComponent implements OnInit {

  private bConnected = false;
  protected id_user = -1;
  private bEmployer = false;
  protected myDataInfo: any;
  private sbscTableInfo: Subscription;
  private infoSubscription: Subscription;

  constructor(private authService: AuthService, private httpLetter: LetterService, private router: Router,
              public translate: TranslateService) {
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
