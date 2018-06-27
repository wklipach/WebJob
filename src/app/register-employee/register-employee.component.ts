import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserTable} from '../class/UserTable';
import {AuthService} from '../services/auth-service.service';
import {isUndefined} from 'util';

@Component({
  selector: 'app-register-employee',
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.css']
})
export class RegisterEmployeeComponent implements OnInit {

  user: UserTable;
  myForm : FormGroup;
  //если имя занято переменная true
  isBoolExistsUser: boolean;
  @Input("isTest") isTest: boolean;

  constructor(private httpService: AuthService) {

    this.isBoolExistsUser = false;
    this.isTest = false;

    this.myForm  = new FormGroup({
      "userName": new FormControl('',
         [Validators.required], [this.userNameAsyncValidator.bind(this)]
      ),



      "userEmail": new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      userPassword1: new FormControl("", Validators.required),
      cbLicense: new FormControl("", Validators.requiredTrue)
    });

  }

  ngOnInit() {
  }

  submit(){
    this.getBoolTenUser('ЗАГЛУШКА');
  }

  getBoolTenUser (UserName: string) {

    return this.httpService.getDataUserTable(UserName).subscribe(
      (data: UserTable) => {
        this.user = data;
        this.isBoolExistsUser = this.getCheckUser (data,UserName);
      }
    );


  }

    getCheckUser (ListUser: UserTable, UserName: string): boolean
    {
    // console.log('--------', Object(ListUser).length );

      //console.log('UserName=', UserName);
      var ResUser = Object(ListUser).find( x => x.UserName === UserName.trim());
      if (isUndefined(ResUser)) {return false;} else {return true;}

   }

  // валидатор
  userNameAsyncValidator(control: FormControl): Promise<{[s:string]:boolean}> {
    return new Promise(
      (resolve, reject)=>{

        return this.httpService.getDataUserTable(control.value).subscribe(
          (data: UserTable) => {
            if (this.getCheckUser (data,control.value) === true) {
              resolve( {"myError": true})
            }
            else {
              resolve(null)
            }
          }
        );
      }
    );
  }

}
