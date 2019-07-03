import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserTable} from '../../class/UserTable';
import {AuthService} from '../../services/auth-service.service';
import {Router} from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { timer } from 'rxjs/observable/timer';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm : FormGroup;
  public showErr : boolean = false;
  public showSucc : boolean = false;
  public sResTrouble : string = '';
  public stopCondition: boolean = false;
  private subscribeTimer:  Subscription;

  constructor(private httpService: AuthService, private router: Router,  public translate: TranslateService) {

    this.loginForm  = new FormGroup({
      'nameOrEmail': new FormControl('',
        [Validators.required, Validators.minLength(3)]),
      'password': new FormControl('',
      [Validators.required])
    });
  }

  ngOnInit() {


  }

  ngOnDestroy() {
  if (typeof this.subscribeTimer !== 'undefined') {
    this.subscribeTimer.unsubscribe();
  }
  }

  getCheckNameOrEmailAndPassword (ListUser: UserTable, tUser : {sUserOrEmail : string, sPassword : string} ): {bCheck: boolean, uName: string, id_user: number, bEmployer: boolean}
  {

    var ResUser = Object(ListUser)
                 .filter( x => x.UserName.trim().toLowerCase() === tUser.sUserOrEmail.trim().toLowerCase() || x.EMail.trim().toLowerCase() === tUser.sUserOrEmail.trim().toLowerCase())
                 .filter(y => y.Password.trim().toLowerCase() === CryptoJS.SHA256(tUser.sPassword.trim().toLowerCase()).toString().toLowerCase());

    //console.log('ResUser[id]', ResUser);
    //console.log('ResUser[id]', ResUser, ResUser[0].id);

    if (ResUser.length === 1) {  console.log('вернули',ResUser[0].UserName); return {bCheck: true, uName: ResUser[0].UserName, id_user: ResUser[0].id, bEmployer : ResUser[0].bEmployer } } else {
      if (ResUser.length === 0) {
        this.sResTrouble = 'Не существующие имя или пароль.';
        return {bCheck: false, uName: '', id_user: -1, bEmployer: false};
      } else {
        this.sResTrouble = 'Существует несколько пользователей с такими именем или паролем.';
        return {bCheck: false, uName: '', id_user: -1, bEmployer: false};
      }

    }
  }


  submit() {

    const sUserOrEmail = this.loginForm.controls['nameOrEmail'].value;
    const sPassword = this.loginForm.controls['password'].value;

    const tUser =  {sUserOrEmail: this.loginForm.controls['nameOrEmail'].value, sPassword: this.loginForm.controls['password'].value};

    return this.httpService.getDataUserTable(sUserOrEmail).subscribe(
      (data: UserTable) => {

        const curRes: {bCheck: boolean, uName: string, id_user: number, bEmployer: boolean} = this.getCheckNameOrEmailAndPassword (data, tUser);

        if (curRes.bCheck === true) {
          this.httpService.login(curRes.uName, curRes.id_user, curRes.bEmployer);
          this.httpService.IsUserLoggedIn.next({connect : true, name : curRes.uName, id_user: curRes.id_user, bEmployer: curRes.bEmployer });

          window.localStorage.setItem('htUserName', JSON.stringify(curRes.uName));
          window.localStorage.setItem('bConnected', JSON.stringify(true));
          window.localStorage.setItem('id_user', JSON.stringify(curRes.id_user));
          window.localStorage.setItem('bEmployer', JSON.stringify(curRes.bEmployer));

          this.showSucc = true;
          this.showErr = false;
          this.router.navigate(['/smain']);
        }
        else {
           this.httpService.IsUserLoggedIn.next({connect : false, name : '', id_user: -1, bEmployer: false});
          this.httpService.logout();
          this.showSucc = false;
          this.showErr = true;
          //блокируем кнопку 5 секунд
          this.stopCondition = true;

          this.subscribeTimer =  timer(5000).subscribe(()=>
            this.stopCondition = false );
        }
      });
  }


}



