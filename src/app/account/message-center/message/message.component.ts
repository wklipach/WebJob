import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {LetterService} from '../../../services/letter.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth-service.service';
import {UserType} from '../../../class/UserType';
import {Letter} from '../../../class/Letter';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {


  protected messageSubscription: Subscription;
  protected _letter: any;
  protected form: FormGroup;
  protected base64textString = [];
  private id_user: number = -1;
  private subscrDataUserFromId: Subscription;
  private loadUser: UserType;



  constructor(private httpLetter: LetterService,
              private auth: AuthService,
              private fb: FormBuilder) {

    var Res =  this.auth.loginStorage();
    if (Res.bConnected) this.id_user = Res.id_user; else this.id_user = -1;

    this.createForm();

  }


  loadPicture(id_user: number) {
        this.subscrDataUserFromId = this.auth.getDataUserFromId(id_user).subscribe(value => {
        // вытаскиваем из базы картинку аватара
        this.loadUser = value as UserType;
        let S = this.loadUser['Avatar'].Avatar;
        if (typeof S !== 'undefined') {
              if (S.length > 0) { this.base64textString.push('data:image/png;base64,' + JSON.parse(S).value); }
        }
      });
  }


  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      avatar: ''
    });
  }


  parseLetter(anyLetter: any) {
      this.httpLetter.getUserName(anyLetter.letter.id_user_from,anyLetter.letter.id_user_to).subscribe((value) => {
        var arr = Object.values(value);
        anyLetter.UserFrom = arr.find(x => x.id === anyLetter.letter.id_user_from).UserName;
        anyLetter.UserTo = arr.find(x => x.id === anyLetter.letter.id_user_to).UserName;
        this._letter = anyLetter;
        this.loadPicture(anyLetter.letter.id_user_from);
      });
  }

  ngOnInit() {

    this.base64textString = [];

    this.messageSubscription = this.httpLetter.getLetter()
      .subscribe (oLetter => {
        if (typeof oLetter !== 'undefined') {
          let anyLetter: any = oLetter;
          this.parseLetter(anyLetter);
        } else {
            if (window.localStorage.getItem('_letterid') !== null) {
              let lid = parseInt(window.localStorage.getItem('_letterid'));
              this.httpLetter.getAnyLetter(lid).subscribe(curLetter => {
                  if (typeof curLetter[0] !== 'undefined') {
                    let anyLetter: any = curLetter[0];
                    //console.log('anyLetter',anyLetter);
                    this.parseLetter(anyLetter);
                  }
                }
              );
            }
          }
      });
  }



  onProfileClick(event) {
    console.log('$event',event);
  }

  ngOnDestroy() {
    if (typeof this.messageSubscription !== 'undefined') {
      this.messageSubscription.unsubscribe();
    }
  }


}
