import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {TableVacancyService} from '../services/table-vacancy.service';
import {MoveService} from '../services/move.service';
import {LetterService} from '../services/letter.service';

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
  numberCountNotReadLetter: number = 0;
  numberCountNotReadBell: number = 0;

  sNullValueFind : string = '';

  constructor(private httpService: AuthService, private router: Router,
                      private httpTvsService: TableVacancyService, private moveS: MoveService,
                      private curRoute: ActivatedRoute, private letServ: LetterService  ) {

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



    //console.log('ht1',this.id_user);

    this.sElementMask  = this.moveS.getStringFind();

    console.log('ht2');

    this.sNullValueFind = this.moveS.getNullValueFind();

    console.log('ht3');

    // обнуляем сервис после вывода предупреждающего сообщения об неуспешном поиске
    this.moveS.setNullValueFind('');

    console.log('ht4');

    this.countNotReadLetter();

    console.log('ht5');

    this.countCountNotReadBell();

    console.log('ht6');

  }

  //numberCountNotReadBell
  countCountNotReadBell() {
    if (this.bConnected) {
      //TODO подсчет количества непрочитанных писем

        this.letServ.getCountNotReadBell(this.id_user).subscribe(
          (value: any[]) => {


            if (value !== null) {
              console.log('Bell value.length', value.length, 'this.id_user', this.id_user);
              this.numberCountNotReadBell = value.length;
            }
          }
        );
    } else
      this.numberCountNotReadBell = -1;
  }

  countNotReadLetter() {
    if (this.bConnected) {
          //TODO подсчет количества непрочитанных писем
      this.letServ.getCountNotReadLetter(this.id_user).subscribe(
        (value: any[]) => {
          //console.log('value.length', value.length, 'this.id_user', this.id_user);
          if (value !== null) this.numberCountNotReadLetter = value.length; else this.numberCountNotReadLetter = -1;
        }
      )} else
      this.numberCountNotReadLetter = -1;
  }

  logout() {

    window.localStorage.removeItem('htUserName');
    window.localStorage.removeItem('bConnected');
    window.localStorage.removeItem('bEmployer');
    window.localStorage.removeItem('id_user');
    this.httpService.IsUserLoggedIn.next({connect : false, name : '', id_user: -1, bEmployer: false});
    this.router.navigate(['/']);
  }






  favorites() {
    // TODO ПОКАЗ ФАВОРИТов 2
    this.httpTvsService.getFavoritesVacancy(this.id_user).subscribe((favor) =>{
      let s='?&id=-1'; //-1 чтобы иметь пустой курсор в случае отсутствия избранных
      for (let curFavor in favor) {
        s=s+'&id='+favor[curFavor].id_vc;
      }
      window.localStorage.setItem('stringFavorites', s);
      this.getVacancy('',true, false);
    });

  }


  clearfind() {
     this.getVacancy('', false, false);

//    window.localStorage.removeItem('keyFind');
//    this.router.navigate(['/home']);



  }




  find() {

    console.log('нажали обычный поиск!!!!!');

    const sInputSearch = this.headerTopForm.controls['inputSearch'].value;
    this.getVacancy(sInputSearch, false, false);
  }


  //
  // запускаем триггер события
  //
  getVacancy(sMask: string,isFavorites: boolean, isAdvancedFind: boolean) {

    this.sNullValueFind = '';

    window.localStorage.setItem('backPage', this.router.url);
    // если домашняя страница запускаем событие, если нет переходим на нее и маску передаем через Экстракт
    // событие инициализируется фактом запуска компонента Home и наличием маски
    if ( (this.router.isActive('home',true)===false)  && (this.router.isActive('',true) ===false)  ) {
      window.localStorage.setItem('keyFind', sMask);
      this.router.navigate(['/']);

     } else {
      window.localStorage.removeItem('keyFind');
      this.httpTvsService.triggerReopenVacancy({sMask, isFavorites, isAdvancedFind});
    }

  }

  toAdvance() {
    this.router.navigate(['/advanced-search']);
  }


}
