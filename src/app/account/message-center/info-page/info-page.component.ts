import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth-service.service';
import {FormBuilder} from '@angular/forms';
import {InfoService} from '../../../services/info.service';
import {Info} from '../../../class/Info';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.css']
})
export class InfoPageComponent implements OnInit {

  private id_user: number = -1;
  anyInfo: Info = null;

  constructor(private httpInfo: InfoService,
              private auth: AuthService,
              private fb: FormBuilder) {

    var Res =  this.auth.loginStorage();
    if (Res.bConnected) this.id_user = Res.id_user; else this.id_user = -1;
  }

  ngOnInit() {

    if (window.localStorage.getItem('_infoid') !== null) {

      let Iid = parseInt(window.localStorage.getItem('_infoid'));

      this.httpInfo.getAnyInfo(Iid).subscribe(curInfo => {
          if (typeof curInfo[0] !== 'undefined') {
            this.anyInfo = curInfo[0];
          }
        }
      );
    }


  }

}
