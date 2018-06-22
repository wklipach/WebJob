import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register-employee',
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.css']
})
export class RegisterEmployeeComponent implements OnInit {

  myForm : FormGroup;

  constructor() {

    this.myForm  = new FormGroup({
      "userName": new FormControl("", Validators.required),
      "userEmail": new FormControl("", [
        Validators.required,
        Validators.pattern("[a-zA-Z_]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}")
      ]),
      userPassword1: new FormControl("", Validators.required),
      cbLicense: new FormControl("", Validators.required)
    });

  }

  ngOnInit() {
  }

  submit(){
    console.log(this.myForm);
  }

}
