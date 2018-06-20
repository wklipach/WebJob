import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth-service.service';
import {UserTable} from '../class/UserTable';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private httpService: AuthService) {
  }

  user: UserTable;

  ngOnInit() {


    console.log('fffffffffffffffffffffffffffffffff');

    this.httpService.getDataUserTable().subscribe(
      (data: UserTable) => {
        this.user = data;
        console.log(this.user)
      }
    );
  }
}

