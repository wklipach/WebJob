import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserTable} from '../../../class/UserTable';
import {AuthService} from '../../../services/auth-service.service';
import {isUndefined} from 'util';
import {UserType} from '../../../class/UserType';
import {Router} from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-register-employee',
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.css']
})
export class RegisterEmployeeComponent implements OnInit {

  user: UserTable;
  myForm: FormGroup;
  protected _bLicense: boolean = false;
  public bPassword: boolean = false;


  get bLicense():boolean {
    return this._bLicense;
  }
  set bLicense(theLicense:boolean) {
    this._bLicense = theLicense;
  }


  licenseShow() {
    this.bLicense =  !this.bLicense;
  }


  constructor(private httpService: AuthService, private router: Router) {

    this.bPassword = false;

    this.myForm  = new FormGroup({
      'userName': new FormControl('',
         [Validators.required],[this.userNameAsyncValidator.bind(this)]
      ),

      'userEmail': new FormControl(null, [
        Validators.required,
        Validators.email
      ], [this.userEmailAsyncValidator.bind(this)]
      ),
      'userPassword1': new FormControl('', [Validators.required, Validators.minLength(1)]),
      'userPassword2': new FormControl('', [Validators.required, Validators.minLength(1)], [this.password2AsyncValidator.bind(this)]),
      'cbLicense': new FormControl('', Validators.requiredTrue),

      'surname': new FormControl({}),
      'dateBirth': new FormControl({}),
      'name': new FormControl({})
    });

  }

  ngOnInit() {
  }

  submit(){

    this.bPassword = false;

    const {userName, userEmail, userPassword1, userPassword2} = this.myForm.value;

    if (userPassword1.trim() !== userPassword2.trim()) {
      console.log('Пароли не совподают');
      this.bPassword = true;
      return -1;
    }

    const AddUser  = new UserType(userName,userEmail,
      CryptoJS.SHA256(userPassword1.trim().toLowerCase()).toString().toLowerCase(),
      false, -1,'','','','','', 0,0,'','','','');

    console.log(AddUser);

    return this.httpService.postDataUserTable(AddUser).subscribe(
      () => {
        this.router.navigate(['/login']); }
    );

  }

    getCheckUser (ListUser: UserTable, UserName: string): boolean
    {
      var ResUser = Object(ListUser).find( x => x.UserName.toLowerCase() === UserName.trim().toLowerCase());
      if (isUndefined(ResUser)) {return false;} else {return true;}
    }


  // валидатор по паролю
  password2AsyncValidator(control: FormControl): Promise<{[s:string]: boolean}> {
    return new Promise(
      (resolve, reject)=>{
            if (this.myForm.controls['userPassword1'].value !== control.value) {
              resolve( {'myError': true});
            }
            else {
              resolve(null);
            }
      }
    );
  }


  // валидатор по имени пользователя
  userNameAsyncValidator(control: FormControl): Promise<{[s:string]: boolean}> {
    return new Promise(
      (resolve, reject)=>{

        return this.httpService.getDataUserTable(control.value).subscribe(
          (data: UserTable) => {
            if (this.getCheckUser (data,control.value) === true) {
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


}
