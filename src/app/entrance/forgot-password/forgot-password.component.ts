import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {isUndefined} from "util";
import {UserTable} from '../../class/UserTable';
import {AuthService} from '../../services/auth-service.service';
import {ForgotpasswordService} from '../../services/forgotpassword.service';
import * as CryptoJS from 'crypto-js';
import {timer} from 'rxjs/observable/timer';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  forgotForm : FormGroup;

  public showSucc : boolean = false;
  public showErr : boolean = false;
  public stopCondition: boolean = false;

  subscribeTimer: Subscription;

  constructor(private httpService: AuthService, private fps: ForgotpasswordService) {

    this.forgotForm  = new FormGroup({
      'nameOrEmail': new FormControl('',
        [Validators.required, Validators.minLength(2)]
      )
    });

  }


  ngOnInit() {
  }

  ngOnDestroy() {
    if (typeof this.subscribeTimer !== 'undefined') {
      this.subscribeTimer.unsubscribe();
    }
  }


  getCheckNameOrEmail (ListUser: UserTable, sNameOrEmail: string): boolean
  {
    let ResUser = Object(ListUser).find( x => x.UserName.toLowerCase() === sNameOrEmail.trim().toLowerCase() || x.EMail.toLowerCase() === sNameOrEmail.trim().toLowerCase() );

    //console.log('ResUser[EMail]', ResUser['EMail']);

    if (isUndefined(ResUser)) {return false;} else {return true;}
  }

  getEmail (ListUser: UserTable, sNameOrEmail: string): string
  {
    let ResUser = Object(ListUser).find( x => x.UserName.toLowerCase() === sNameOrEmail.trim().toLowerCase() || x.EMail.toLowerCase() === sNameOrEmail.trim().toLowerCase() );
    if (isUndefined(ResUser)) {return '';} else {return ResUser['EMail'];}
  }


  submit()  {


    const sUserOrEmail = this.forgotForm.controls['nameOrEmail'].value;
    return this.httpService.getDataUserTable(sUserOrEmail).subscribe(
      (data: UserTable) => {
        if (this.getCheckNameOrEmail (data,sUserOrEmail) === true) {
           this.showSucc = true;
          this.showErr = false;
          const newpwd =  this.randomPass(12,true,'',true);
          console.log('newpwd',newpwd);

          const hash = CryptoJS.SHA256(newpwd.trim().toLowerCase()).toString().toLowerCase();

          let email = this.getEmail (data, sUserOrEmail);

          if (email === '') {
            this.showSucc = false;
            this.showErr = true;
            return;
          }

          this.fps.sendPassword(email, newpwd, hash).subscribe(
            value=> {
              console.log('результат отправки письма', value);
              this.Block5Sec();

            });

        }
        else {
          this.showSucc = false;
          this.showErr = true;
          this.Block5Sec();
        }
      }
    );

  }



  Block5Sec() {
    //блокируем кнопку 5 секунд
    this.stopCondition = true;
    this.subscribeTimer =  timer(5000).subscribe(()=>
      this.stopCondition = false );
  }


  randomPass (length, addUpper, addSymbols, addNums) {
    var lower = "abcdefghijklmnopqrstuvwxyz";
    var upper = addUpper ? lower.toUpperCase() : "";
    var nums = addNums ? "0123456789" : "";
    var symbols = addSymbols ? "!#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~" : "";

    var all = lower + upper + nums + symbols;
    while (true) {
      var pass = "";
      for (var i=0; i<length; i++) {
        pass += all[Math.random() * all.length | 0];
      }

      // criteria:
      if (!/[a-z]/.test(pass)) continue; // lowercase is a must
      if (addUpper && !/[A-Z]/.test(pass)) continue; // check uppercase
      if (addSymbols && !/\W/.test(pass)) continue; // check symbols
      if (addNums && !/\d/.test(pass)) continue; // check nums

      return pass; // all good
    }
  }

}
