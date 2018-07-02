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
         [Validators.required], [this.userNameAsyncValidator.bind(this)]
      ),

      'userEmail': new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      'userPassword1': new FormControl('', Validators.required),
      'cbLicense': new FormControl('', Validators.requiredTrue)
    });

  }

  ngOnInit() {
  }

  submit(){

    const {userName, userEmail, userPassword1} = this.myForm.value;

    const AddUser  = new UserType(userName,userEmail,userPassword1,true); // (userName,  userEmail, userPassword1,true);

    console.log(AddUser);

    return this.httpService.postDataUserTable(AddUser).subscribe(
      () => {
        this.router.navigate(['/login']); }
    )

  }

    getCheckUser (ListUser: UserTable, UserName: string): boolean
    {
      var ResUser = Object(ListUser).find( x => x.UserName.toLowerCase() === UserName.trim().toLowerCase());
      if (isUndefined(ResUser)) {return false;} else {return true;}
   }

  // валидатор
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

}
