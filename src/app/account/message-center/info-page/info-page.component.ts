import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth-service.service';
import {FormBuilder} from '@angular/forms';
import {InfoService} from '../../../services/info.service';
import {LetterService} from '../../../services/letter.service';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.css']
})
export class InfoPageComponent implements OnInit {

  private id_user: number = -1;
  anyInfo: any = null;

  constructor(private httpInfo: InfoService,
              private httpLetter: LetterService,
              private auth: AuthService,
              private fb: FormBuilder) {

    var Res =  this.auth.loginStorage();
    if (Res.bConnected) this.id_user = Res.id_user; else this.id_user = -1;
  }

  ngOnInit() {

    if (window.localStorage.getItem('_infoid') !== null) {

      let Iid = parseInt(window.localStorage.getItem('_infoid'));

      //console.log('ip', Iid);

      this.httpLetter.setOldLetter(Iid).subscribe(postInfo => {
        //console.log('ip postInfo', postInfo);
          if (typeof postInfo !== 'undefined') {
                this.httpLetter.getAnyLetter(Iid).subscribe(curInfo => {

                 // console.log('ip curInfo', curInfo);

                  if (typeof curInfo[0] !== 'undefined') {this.anyInfo = curInfo[0];}
                });
          }
        }
      );


    }


  }

}
