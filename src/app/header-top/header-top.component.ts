import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth-service.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {TableVacancyService} from '../services/table-vacancy.service';
import {MoveService} from '../services/move.service';

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.css']
})
export class HeaderTopComponent implements OnInit {

  headerTopForm : FormGroup;
  htUserName = '';
  bConnected = false;
  sElementMask: string = '';
  id_user: number;

  constructor(private httpService: AuthService, private router: Router, private httpTvsService: TableVacancyService, private moveS: MoveService) {

    this.headerTopForm = new FormGroup({
      'inputSearch': new FormControl('',[])
    });


    this.httpService.IsUserLoggedIn.subscribe(value => {
      this.htUserName = value.name;
      this.bConnected = value.connect;
      this.id_user = value.id_user;
      // console.log('this.htUserName =', this.htUserName);
    });


  }

  ngOnInit() {

    var Res =  this.httpService.loginStorage();
    this.htUserName = Res.htUserName;
    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;

    this.sElementMask  = this.moveS.getStringFind();

  }

  login() {

    this.router.navigate(['/login']);
  }


  logout() {

    window.localStorage.removeItem('htUserName');
    window.localStorage.removeItem('bConnected');
    window.localStorage.removeItem('id_user');
    this.httpService.IsUserLoggedIn.next({connect : false, name : '', id_user: -1});
    this.router.navigate(['/']);
  }


  find() {
    const sInputSearch = this.headerTopForm.controls['inputSearch'].value;
    this.getVacancy(sInputSearch);
  }


  //
  // запускаем триггер события
  //
  getVacancy(sMask: string) {

    // если домашняя страница запускаем событие, если нет переходим на нее и маску передаем через Экстракт
    if ( (this.router.isActive('home',true)===false)  && (this.router.isActive('',true) ===false)  ) {
       window.localStorage.setItem('keyFind', sMask);
      this.router.navigate(['/']);
     } else {
      window.localStorage.removeItem('keyFind');
      this.httpTvsService.triggerReopenVacancy(sMask);
    }


  }



}
