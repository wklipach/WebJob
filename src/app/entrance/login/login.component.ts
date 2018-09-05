import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserTable} from '../../class/UserTable';
import {AuthService} from '../../services/auth-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm : FormGroup;
  public showErr : boolean = false;
  public showSucc : boolean = false;
  public sResTrouble : string = '';

  constructor(private httpService: AuthService, private router: Router) {

    this.loginForm  = new FormGroup({
      'nameOrEmail': new FormControl('',
        [Validators.required, Validators.minLength(2)]),
      'password': new FormControl('',
      [Validators.required])
    });
  }

  ngOnInit() {


  }


  getCheckNameOrEmailAndPassword (ListUser: UserTable, tUser : {sUserOrEmail : string, sPassword : string} ): {bCheck: boolean, uName: string, id_user: number}
  {

    var ResUser = Object(ListUser)
                 .filter( x => x.UserName.trim().toLowerCase() === tUser.sUserOrEmail.trim().toLowerCase() || x.EMail.trim().toLowerCase() === tUser.sUserOrEmail.trim().toLowerCase())
                 .filter(y => y.Password.trim().toLowerCase() === tUser.sPassword.trim().toLowerCase());


    console.log('ResUser[id]', ResUser, ResUser[0].id);

    if (ResUser.length === 1) {  console.log('вернули',ResUser[0].UserName); return {bCheck: true, uName: ResUser[0].UserName, id_user: ResUser[0].id} } else {
      if (ResUser.length === 0) {
        this.sResTrouble = 'Не существующие имя или пароль.';
        return {bCheck: false, uName: '', id_user: -1};
      } else {
        this.sResTrouble = 'Существует несколько пользователей с такими именем или паролем.';
        return {bCheck: false, uName: '', id_user: -1};
      }

    }
  }


  submit() {
    const sUserOrEmail = this.loginForm.controls['nameOrEmail'].value;
    const sPassword = this.loginForm.controls['password'].value;

    const tUser =  {sUserOrEmail: this.loginForm.controls['nameOrEmail'].value, sPassword: this.loginForm.controls['password'].value};

    return this.httpService.getDataUserTable(sUserOrEmail).subscribe(
      (data: UserTable) => {

        const curRes: {bCheck: boolean, uName: string, id_user: number} = this.getCheckNameOrEmailAndPassword (data, tUser);

        if (curRes.bCheck === true) {
          this.httpService.login(curRes.uName, curRes.id_user);
          this.httpService.IsUserLoggedIn.next({connect : true, name : curRes.uName, id_user: curRes.id_user });

          window.localStorage.setItem('htUserName', JSON.stringify(curRes.uName));
          window.localStorage.setItem('bConnected', JSON.stringify(true));
          window.localStorage.setItem('id_user', JSON.stringify(curRes.id_user));

          console.log('НАЖАЛИ ЛОГИН', curRes.uName);
          this.showSucc = true;
          this.showErr = false;
          this.router.navigate(['/home']);
        }
        else {
          this.httpService.IsUserLoggedIn.next({connect : false, name : '', id_user: -1});
          this.httpService.logout();
          this.showSucc = false;
          this.showErr = true;
        }
      }
    );


  }


}
