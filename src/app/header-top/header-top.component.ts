import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth-service.service';

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.css']
})
export class HeaderTopComponent implements OnInit {

  htUserName = '';
  bConnected = false;

  constructor(private httpService: AuthService) {
    this.httpService.IsUserLoggedIn.subscribe(value => {
      this.htUserName = value.name;
      this.bConnected = value.connect;
      console.log('this.htUserName =', this.htUserName);
    });



  }

  ngOnInit() {

    this.htUserName = JSON.parse(window.localStorage.getItem('htUserName'));
    this.bConnected = JSON.parse(window.localStorage.getItem('bConnected'));

  }


  logout() {

    window.localStorage.removeItem('htUserName');
    window.localStorage.removeItem('bConnected');
    this.httpService.IsUserLoggedIn.next({connect : false, name : ''});
  }

}
