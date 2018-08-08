import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth-service.service';
import {UserTable} from '../../../class/UserTable';
import {Router} from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router) {
  }

  myForm : FormGroup;

  ngOnInit() {
    // assets/img/b3291e37c5413656444d23e0bec71e2b.jpg
  }

  newFunction(event) {
    console.log (event.explicitOriginalTarget.id);
    if (event.explicitOriginalTarget.id == 'rEmployee') {
      this.router.navigate(['/employee']);
    }

    if (event.explicitOriginalTarget.id == 'rEmployer') {
      this.router.navigate(['/employer']);
    }

  }

  submit(){
    // console.log(this.myForm);
  }


}

