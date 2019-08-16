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

  constructor(private router: Router, public translate: TranslateService) {
  }

  myForm : FormGroup;

  ngOnInit() {
    // assets/img/b3291e37c5413656444d23e0bec71e2b.jpg
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

