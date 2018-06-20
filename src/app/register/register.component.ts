import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth-service.service';
import {UserTable} from '../class/UserTable';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: UserTable;
  checkRegisterRadio: boolean;

  constructor(private httpService: AuthService) { }




  ngOnInit() {

    this.httpService.getDataUserTable().subscribe(
      (data: UserTable ) => {
        this.user = data;
        console.log(this.user);
      }
    );
  }

  newFunction() {
    console.log ('Это соискатель !');
  }
}
