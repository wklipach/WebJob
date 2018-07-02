import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {isUndefined} from "util";
import {UserTable} from '../../class/UserTable';
import {AuthService} from '../../services/auth-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm : FormGroup;

  public showSucc : boolean = false;
  public showErr : boolean = false;

  constructor(private httpService: AuthService) {

    this.forgotForm  = new FormGroup({
      'nameOrEmail': new FormControl('',
        [Validators.required, Validators.minLength(2)]
      )
    });

  }


  ngOnInit() {
  }


  getCheckNameOrEmail (ListUser: UserTable, sNameOrEmail: string): boolean
  {
    var ResUser = Object(ListUser).find( x => x.UserName.toLowerCase() === sNameOrEmail.trim().toLowerCase() || x.EMail.toLowerCase() === sNameOrEmail.trim().toLowerCase() );
    if (isUndefined(ResUser)) {return false;} else {return true;}
  }



  submit()  {
    const sUserOrEmail = this.forgotForm.controls['nameOrEmail'].value;
    return this.httpService.getDataUserTable(sUserOrEmail).subscribe(
      (data: UserTable) => {
        if (this.getCheckNameOrEmail (data,sUserOrEmail) === true) {
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
