import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserTable} from '../../../class/UserTable';
import {isUndefined} from 'util';
import {AuthService} from '../../../services/auth-service.service';
import {Router} from '@angular/router';
import {UserType} from '../../../class/UserType';
import * as CryptoJS from 'crypto-js';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-register-employer',
  templateUrl: './register-employer.component.html',
  styleUrls: ['./register-employer.component.css']
})
export class RegisterEmployerComponent implements OnInit {

  user: UserTable;
  protected _bLicense: boolean = false;
  public bPassword: boolean = false;

  formRegisterEmployer: FormGroup;


  get bLicense():boolean {
    return this._bLicense;
  }
  set bLicense(theLicense:boolean) {
    this._bLicense = theLicense;
  }


  licenseShow() {
     this.bLicense =  !this.bLicense;
  }


  constructor(private httpService: AuthService,
              private router: Router,
              public translate: TranslateService) {

    this.formRegisterEmployer  = new FormGroup({
      'userName': new FormControl('',
        [Validators.required], [this.employerNameAsyncValidator.bind(this)]
      ),

      'userEmail': new FormControl(null, [
          Validators.required,
          Validators.email
        ], [this.employerEmailAsyncValidator.bind(this)]
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

  submit() {

    this.bPassword = false;

    const {userName, userEmail, userPassword1, userPassword2} = this.formRegisterEmployer.value;

    if (userPassword1.trim() !== userPassword2.trim()) {
      console.log(' Пароли не совподают ');
      this.bPassword = true;
      return -1;
    }


    const AddUser  = new UserType(userName,userEmail,
       CryptoJS.SHA256(userPassword1.trim().toLowerCase()).toString().toLowerCase(),
      true, -1,'','','','','',0, 0,
      '',
      '',
      '',
      '');
    console.log(AddUser);

    return this.httpService.postDataUserTable(AddUser).subscribe(
      () => {
        this.router.navigate(['/login']); }
    );


  }


  // валидатор по паролю
  password2AsyncValidator(control: FormControl): Promise<{[s:string]: boolean}> {
    return new Promise(
      (resolve, reject)=>{
        if (this.formRegisterEmployer.controls['userPassword1'].value !== control.value) {
          resolve( {'myError': true});
        }
        else {
          resolve(null);
        }
      }
    );
  }

  // валидатор по имени работодателя
  employerNameAsyncValidator(control: FormControl): Promise<{[s:string]: boolean}> {
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
  employerEmailAsyncValidator(control: FormControl): Promise<{[s:string]: boolean}> {
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
