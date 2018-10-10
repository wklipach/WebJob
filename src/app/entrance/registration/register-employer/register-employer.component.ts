import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserTable} from '../../../class/UserTable';
import {isUndefined} from 'util';
import {AuthService} from '../../../services/auth-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register-employer',
  templateUrl: './register-employer.component.html',
  styleUrls: ['./register-employer.component.css']
})
export class RegisterEmployerComponent implements OnInit {

  user: UserTable;
  formRegisterEmployer: FormGroup;

  constructor(private httpService: AuthService, private router: Router) {
    this.formRegisterEmployer  = new FormGroup({
      'userName': new FormControl('',
        [Validators.required], [this.userNameAsyncValidator.bind(this)]
      ),

      'userEmail': new FormControl(null, [
          Validators.required,
          Validators.email
        ], [this.userEmailAsyncValidator.bind(this)]
      ),
      'userPassword1': new FormControl('', Validators.required),
      'cbLicense': new FormControl('', Validators.requiredTrue),

      'surname': new FormControl({}),
      'dateBirth': new FormControl({}),
      'name': new FormControl({})
    });
  }

  ngOnInit() {
  }

  submit() {
    console.log('btn-push');

  }

  // валидатор по имени пользователя
  userNameAsyncValidator(control: FormControl): Promise<{[s:string]: boolean}> {
    return new Promise(
      (resolve, reject) => {

        return this.httpService.getDataUserTable(control.value).subscribe(
          (data: UserTable) => {
            if (this.getCheckUser (data, control.value) === true) {
              resolve( {'myError': true});
            }
            else {
              resolve(null);
            }
          }
        );
      }
    );
  }


  getCheckEmail (ListUser: UserTable, sEmail: string): boolean
  {
    var ResUser = Object(ListUser).find( x => x.EMail.toLowerCase() === sEmail.trim().toLowerCase());
    if (isUndefined(ResUser)) {return false;} else {return true;}
  }

  // валидатор по EMail
  userEmailAsyncValidator(control: FormControl): Promise<{[s:string]: boolean}> {
    return new Promise(
      (resolve, reject)=>{

        return this.httpService.getDataUserTable(control.value).subscribe(
          (data: UserTable) => {
            if (this.getCheckEmail (data,control.value) === true) {
              resolve( {'errorEmailExists': true});
            }
            else {
              resolve(null);
            }
          }
        );
      }
    );
  }

  getCheckUser (ListUser: UserTable, UserName: string): boolean
  {
    var ResUser = Object(ListUser).find( x => x.UserName.toLowerCase() === UserName.trim().toLowerCase());
    if (isUndefined(ResUser)) {return false;} else {return true;}
  }
}
