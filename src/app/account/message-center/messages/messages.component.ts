import { Component, OnInit } from '@angular/core';
import {Letter} from '../../../class/Letter';
import {AuthService} from '../../../services/auth-service.service';
import {Subscription} from 'rxjs';
import {LetterService} from '../../../services/letter.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  private bConnected = false;
  private id_user = -1;
  private bEmployer = false;
  protected myDataLetter: any;
  private sbscTableLetter: Subscription;

  constructor (private authService: AuthService, private httpLetter: LetterService) {
    var Res =  this.authService.loginStorage();
    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;
    this.bEmployer = Res.bEmployer;
  }

  ngOnInit() {

    return this.sbscTableLetter = this.httpLetter.getListLetter(this.id_user).subscribe(
      (data: Letter[]) => {
        this.myDataLetter = data;
        console.log('вывели письма для',this.id_user);
      });
  }


  curLetterClick(lid: number, $event) {

    console.log('нажали строку',lid);

  }


  ngOnDestroy() {

    if (typeof this.sbscTableLetter !== 'undefined') {
      this.sbscTableLetter.unsubscribe();
    }

  }


}
