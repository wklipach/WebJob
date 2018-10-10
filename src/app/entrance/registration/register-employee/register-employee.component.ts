import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserTable} from '../../../class/UserTable';
import {AuthService} from '../../../services/auth-service.service';
import {isUndefined} from 'util';
import {UserType} from '../../../class/UserType';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register-employee',
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.css']
})
export class RegisterEmployeeComponent implements OnInit {

  user: UserTable;
  myForm: FormGroup;

  constructor(private httpService: AuthService, private router: Router) {

    this.myForm  = new FormGroup({
      'userName': new FormControl('',
         [Validators.required],[this.userNameAsyncValidator.bind(this)]
      ),

      'userEmail': new FormControl(null, [
        Validators.required,
        Validators.email
      ], [this.userEmailAsyncValidator.bind(this)]
      ),
      'userPassword1': new FormControl('', Validators.required),
      'userPassword2': new FormControl('', Validators.required),
      'cbLicense': new FormControl('', Validators.requiredTrue),

      'surname': new FormControl({}),
      'dateBirth': new FormControl({}),
      'name': new FormControl({})
    });

  }

  ngOnInit() {
  }

  submit(){

    const {userName, userEmail, userPassword1} = this.myForm.value;

    const AddUser  = new UserType(userName,userEmail,userPassword1,false, -1,'','','','','');

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
