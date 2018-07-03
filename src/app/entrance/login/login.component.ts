import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserTable} from '../../class/UserTable';
import {AuthService} from '../../services/auth-service.service';

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

  constructor(private httpService: AuthService) {

    this.loginForm  = new FormGroup({
      'nameOrEmail': new FormControl('',
        [Validators.required, Validators.minLength(2)]),
      'password': new FormControl('',
      [Validators.required])
    });
  }

  ngOnInit() {
  }


  getCheckNameOrEmailAndPassword (ListUser: UserTable, tUser : {sUserOrEmail : string, sPassword : string}): boolean
  {

    var ResUser = Object(ListUser)
                 .filter( x => x.UserName.trim().toLowerCase() === tUser.sUserOrEmail.trim().toLowerCase() || x.EMail.trim().toLowerCase() === tUser.sUserOrEmail.trim().toLowerCase())
                 .filter(y => y.Password.trim().toLowerCase()===tUser.sPassword.trim().toLowerCase());

    // console.log('selectedCategory=', selectedCategory);

    console.log('ResUser=', ResUser);

    if (ResUser.length===1) {return true;} else {
      if (ResUser.length===0) {
        this.sResTrouble = 'Не существующие имя или пароль.';
        return false;
      } else {
        this.sResTrouble = 'Существует несколько пользователей с такими именем или паролем.';
        return false;
      }

    }
  }


  submit() {
    console.log('НАЖАЛИ ЛОГИН');
    const sUserOrEmail = this.loginForm.controls['nameOrEmail'].value;
    const sPassword = this.loginForm.controls['password'].value;

    const tUser =  {sUserOrEmail: this.loginForm.controls['nameOrEmail'].value, sPassword: this.loginForm.controls['password'].value};

    return this.httpService.getDataUserTable(sUserOrEmail).subscribe(
      (data: UserTable) => {
        if (this.getCheckNameOrEmailAndPassword (data, tUser) === true) {
          this.showSucc = true;
          this.showErr = false;
        }
        else {
          this.showSucc = false;
          this.showErr = true;
        }
      }
    );



  }


}
