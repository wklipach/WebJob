import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth-service.service';
import {ActivatedRoute, Router} from '@angular/router';
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
  bEmployer : boolean;

  sNullValueFind : string = '';

  constructor(private httpService: AuthService, private router: Router,
                      private httpTvsService: TableVacancyService, private moveS: MoveService,
                      private curRoute: ActivatedRoute  ) {

    this.headerTopForm = new FormGroup({
      'inputSearch': new FormControl('',[])
    });


    this.moveS.onNullFind.subscribe((value) => {
      console.log('event', value);
      this.sNullValueFind = value;
      this.headerTopForm.controls['inputSearch'].setValue('');
    });


    this.httpService.IsUserLoggedIn.subscribe(value => {
      this.htUserName = value.name;
      this.bConnected = value.connect;
      this.id_user = value.id_user;
      this.bEmployer = value.bEmployer;
      // console.log('this.htUserName =', this.htUserName);
    });


  }

  ngOnInit() {

    var Res =  this.httpService.loginStorage();
    this.htUserName = Res.htUserName;
    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;
    this.bEmployer =  Res.bEmployer;

    this.sElementMask  = this.moveS.getStringFind();
    this.sNullValueFind = this.moveS.getNullValueFind();
    // обнуляем сервис после вывода предупреждающего сообщения об неуспешном поиске
    this.moveS.setNullValueFind('');
  }

  login() {
    this.router.navigate(['/login']);
  }


  logout() {

    window.localStorage.removeItem('htUserName');
    window.localStorage.removeItem('bConnected');
    window.localStorage.removeItem('bEmployer');
    window.localStorage.removeItem('id_user');
    this.httpService.IsUserLoggedIn.next({connect : false, name : '', id_user: -1, bEmployer: false});
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

    this.sNullValueFind = '';

    window.localStorage.setItem('backPage', this.router.url);
    // если домашняя страница запускаем событие, если нет переходим на нее и маску передаем через Экстракт
    // событие инициализируется фактом запуска компонента Home и наличием маски
    if ( (this.router.isActive('home',true)===false)  && (this.router.isActive('',true) ===false)  ) {

      window.localStorage.setItem('keyFind', sMask);
      this.router.navigate(['/']);

     } else {
      window.localStorage.removeItem('keyFind');
      this.httpTvsService.triggerReopenVacancy(sMask);
    }

  }

  toAdvance() {
    this.router.navigate(['/advanced-search']);
  }



}
