import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth-service.service';
import {UserTable} from '../../../class/UserTable';
import {Router} from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  bConnected = false;

  constructor(private httpService: AuthService, private router: Router, public translate: TranslateService) {
  }

  myForm : FormGroup;

  ngOnInit() {
    var Res =  this.httpService.loginStorage();
    this.bConnected = Res.bConnected;
    if (this.bConnected) {
      this.router.navigate(['/']);
    }
  }

  newFunctionEmployee(event) {
      this.router.navigate(['/employee']);
  }


  newFunctionEmployer(event) {
      this.router.navigate(['/employer']);
  }



  submit(){
    // console.log(this.myForm);
  }


}

