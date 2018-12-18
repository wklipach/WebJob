import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableVacancyService} from '../services/table-vacancy.service';
import {dataVacancy} from '../class/Vacancy';
import {City} from '../class/City';
import {isNullOrUndefined} from 'util';
import {Router} from '@angular/router';
import {MoveService} from '../services/move.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../services/auth-service.service';
import {CvEditService} from '../services/cv-edit.service';
import {GuideService} from '../services/guide-service.service';
import {DatePipe} from '@angular/common';
import {Letter} from '../class/Letter';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  //заголовок вакансий
  public sVacancy: string;
  // текущая страница
  public page = 1;
  // записей на странице
  public rowPerPage = 5;
  // всего записей после запроса
  public recordsPerAll = 0;

  private bConnected = false;
  private id_user = -1;
  private bEmployer = false;
  public sNoUserValueFind = '';

  myDataVacancy: dataVacancy[];
  allDataVacancy: dataVacancy[];

  private dvSubscription: Subscription;
  private getTableVacancy: Subscription;
  private sbReopenVacancyAdvanced: Subscription;
  private sMask: string = ''


  protected bChecked5 = true;
  protected bChecked10 = false;
  protected bChecked20 = false;
  protected bChecked50 = false;

  base64textString = [];

  constructor(private httpService: TableVacancyService,
              private router: Router,
              private moveS: MoveService,
              private authService: AuthService,
              private cvEditSrv: CvEditService,
              private is: GuideService) {
  }


  OnClickRowPerPage(pecordPerPage: number) {

    this.bChecked5 = false;
    this.bChecked10 = false;
    this.bChecked20 = false;
    this.bChecked50 = false;

    if (pecordPerPage === 5) {
      this.bChecked5 = true;
      window.localStorage.setItem('rowPerPage', '5');
    }
    if (pecordPerPage === 10) {
      this.bChecked10 = true;
      window.localStorage.setItem('rowPerPage', '10');
    }
    if (pecordPerPage === 20) {
      this.bChecked20 = true;
      window.localStorage.setItem('rowPerPage', '20');
    }
    if (pecordPerPage === 50) {
      this.bChecked50 = true;
      window.localStorage.setItem('rowPerPage', '50');
    }

    this.page = 1;
    this.rowPerPage = pecordPerPage;
    this.is.startCheckPaginator({value1: this.recordsPerAll, value2: this.rowPerPage});
    this.reloadPAge(this.allDataVacancy, this.sMask);

  }


  onPageChanged(pageNumber: number) {
    this.reloadPAge(this.allDataVacancy, this.sMask);
  }

  onLoadFromBaseAvatar(k: any) {

    k.base64textString = [];
    if (typeof k.id_user !== 'undefined') {
          this.authService.getDataUserFromId(k.id_user).subscribe((aRes) => {
          if (aRes['Avatar'] != undefined) {
            const S = aRes['Avatar'].Avatar;
            k.base64textString = [];
            k.base64textString.push('data:image/png;base64,' + JSON.parse(S).value);
          }
          });
    }
  }


   private funcCheckedFind(nPageNumber: number)   {

     this.bChecked5 = false;
     this.bChecked10 = false;
     this.bChecked20 = false;
     this.bChecked50 = false;

     if (nPageNumber===5) this.bChecked5 = true;
     if (nPageNumber===10)  this.bChecked10 = true;
     if (nPageNumber===20)  this.bChecked20 = true;
     if (nPageNumber===50)  this.bChecked50 = true;
     if (!this.bChecked5 && !this.bChecked10 && !this.bChecked20 && !this.bChecked50) this.bChecked5 = true;
   }

  ngOnInit() {

    var Res =  this.authService.loginStorage();

    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;
    this.bEmployer = Res.bEmployer;

    this.rowPerPage = 5;
    if (window.localStorage.getItem('rowPerPage') !== '') {

      this.rowPerPage = JSON.parse(window.localStorage.getItem('rowPerPage'));

      if (this.rowPerPage === null) {
        if (this.bChecked5) this.rowPerPage = 5;
        if (this.bChecked10) this.rowPerPage = 10;
        if (this.bChecked20) this.rowPerPage = 20;
        if (this.bChecked50) this.rowPerPage = 50;

        if (this.rowPerPage === null) {
          this.rowPerPage = 5;
        }
      }

    }

    this.funcCheckedFind(this.rowPerPage);

    if (window.localStorage.getItem('keyFind') !== null) {
      this.sMask = window.localStorage.getItem('keyFind');
    }

    window.localStorage.removeItem('keyFind');

    this.httpService.onReopenVacancy.subscribe(({sMask: value, isFavorites: bFavorites, isAdvancedFind: bAdvancedFind }) => {
        this.getVacancy(value, bFavorites, bAdvancedFind);
    });


    // если не было расширенного поиска вакансий делаем обычный поиск, иначе расширенный запускается из advanced-search.component
    if ( this.httpService.getMessageAdvancedFindObj() === null ) {

      // запускаем событие "получить вакансии", в первый раз с пустой маской
      this.httpService.triggerReopenVacancy({sMask: this.sMask, isFavorites: false, isAdvancedFind: false});
      // записываем значение маски в элемент, так как при перегрузке страницы он стирается ??????
      this.moveS.setStringFind(this.sMask);
    } else
    {
      let advancedFindObj = this.httpService.getMessageAdvancedFindObj();
      this.httpService.clearAdvancedFindObj();
      this.getVacancyAdvanced(advancedFindObj);
    }



  }

  getVacancyAdvanced(advancedFindObj: any) {
    // выводим всю таблицу по сути это заглушка вместо продвинутого поиска
    this.getVacancy('', false, true);
  }

   getVacancy(sMask: string,isFavorites: boolean, isAdvancedFind: boolean) {

    return this.getTableVacancy = this.httpService.getTableVacancy(sMask, this.rowPerPage, this.page, isFavorites, isAdvancedFind).subscribe(
      (data: dataVacancy[]) => {

        let curRemDay: {numberMonth, errorDay} = {numberMonth: -1, errorDay: true};

        data.forEach(  (curVacancy, index, arrCurValue) => {
          // base64textString = [];
          this.onLoadFromBaseAvatar(curVacancy['vacancy']);
          // ДАТА ОКОНЧАНИЯ ЗАЯВКИ
            curVacancy['vacancy'].sDateEnd = "";
            curVacancy['vacancy'].errorEndDay = true;

            if (typeof curVacancy['vacancy'].DateTimeCreate !== 'undefined') {
              if (typeof curVacancy['vacancy'].DisplayPeriod !== 'undefined') {

                switch(curVacancy['vacancy'].DisplayPeriod) {
                  case 1: {
                    curRemDay.errorDay = false;
                    curRemDay.numberMonth = 1;
                    break;
                  }
                  case 2: {
                    curRemDay.errorDay = false;
                    curRemDay.numberMonth = 2;
                    break;
                  }

                  case 3: {
                    curRemDay.errorDay = false;
                    curRemDay.numberMonth = 3;
                    break;
                  }

                  default: {
                    curRemDay.errorDay = false;
                    curRemDay.numberMonth = 999999;
                    break;
                  }
                }

                ///// высчитываем дату окончания
                // dd/MM/yyyy hh:mm локаль en-US
                if (!curRemDay.errorDay) {
                  var reggie = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/;
                  var dateArray = reggie.exec(curVacancy['vacancy'].DateTimeCreate);
                  var dateObject = new Date(+dateArray[3], +dateArray[2] - 1, +dateArray[1], +dateArray[4], +dateArray[5], 0, 0);
                  let DateEnd = new Date(dateObject.setMonth(dateObject.getMonth() + curRemDay.numberMonth));
                  var datePipe = new DatePipe("en-US");
                  curVacancy['vacancy'].sDateEnd =  datePipe.transform(DateEnd, 'dd.MM.yyyy');
                  curVacancy['vacancy'].errorEndDay = false;
                }
              }
            }
        }
        );

        this.myDataVacancy = data;
        this.allDataVacancy = data;
        this.recordsPerAll = data.length;
        this.is.startCheckPaginator({value1: this.recordsPerAll, value2: this.rowPerPage});
        this.reloadPAge(this.allDataVacancy, sMask);

        if (isFavorites) this.sVacancy = 'Избранные вакансии'; else this.sVacancy = 'Вакансии';


     }
    );
  }


  // получаем из массива кол. записей и кусок записей на данной странице
  reloadPAge(data: dataVacancy[], sMask: string) {

    data = data.slice(this.rowPerPage*(this.page-1),this.rowPerPage*(this.page-1)+this.rowPerPage);
    // это получаем город из нового вызываемого сервиса
    this.httpService.getCity().subscribe((city: City[]) => {

        data.forEach((eekey, ih) => {

            let idCity = eekey['vacancy'].City;
            if (isNullOrUndefined(idCity) === false) {
              let CurCity = city.find(city => city.id === idCity);
              eekey.CityName = CurCity.name;
            }
          }

        );

        this.myDataVacancy = data;

        if (this.allDataVacancy.length === 0) {

          // console.log('ЕСЛИ НИЧЕГО НЕ НАШЛИ');
          if (window.localStorage.getItem('backPage') !== null) {
            let sBack = window.localStorage.getItem('backPage');
            window.localStorage.removeItem('backPage');
            if (sBack !== '/') {
              this.router.navigateByUrl(sBack);
              this.moveS.setNullValueFind('Поиск не дал результатов.');
            }
            if (sBack === '/' && sMask !== '')  {
              this.sMask = '';
              this.getVacancy('',false,false);
              this.moveS.startNullFind('Поиск не дал результатов.');
            }
          }
        }
        window.localStorage.removeItem('backPage');

      }

    );

  }


  MyMethod(zid: number, $event) {

    if ($event.explicitOriginalTarget.id === 'vcresponse' ||
        $event.explicitOriginalTarget.id === 'vcfavorites' ||
        $event.explicitOriginalTarget.id === 'vchide')
    return;

    let vacancy = this.myDataVacancy.find(vacancy =>  vacancy.id===zid);
     this.dvSubscription = this.moveS.setDataVacancy(vacancy).subscribe( ()=> this.router.navigate(['/vacancy-description']));
  }

  ngOnDestroy() {


    if (typeof this.dvSubscription !== 'undefined') {
      this.dvSubscription.unsubscribe();
    }

    if (typeof this.getTableVacancy !== 'undefined') {
      this.getTableVacancy.unsubscribe();
    }

    if (typeof this.sbReopenVacancyAdvanced !== 'undefined') {
      this.sbReopenVacancyAdvanced.unsubscribe();
    }

  }


  showFavorites(id_user: number) {
    // TODO ПОКАЗ ФАВОРИТов
    this.httpService.getFavoritesVacancy(id_user).subscribe((favor) =>{
      let s='?&id=-1'; //-1 чтобы иметь пустой курсор в случае отсутствия избранных
      for (let curFavor in favor) {
        s=s+'&id='+favor[curFavor].id_vc;
      }
      // console.log('s=',s);
      // 'http://localhost:3000/vacancy'+s;
      window.localStorage.setItem('stringFavorites', s);
      this.getVacancy('',true, false);
    });

  }

  favorites($event, index: number, vcid: number) {

    // TODO ПОСТИНГ ФАВОРИТОВ
    this.sVacancy = 'Вакансии';

   this.sNoUserValueFind = '';
    this.myDataVacancy[index].sErrorText = '';
   if  (!this.bConnected) {
     this.sNoUserValueFind = 'Для использования функции "В избранное" пройдите верификацию.';
     this.myDataVacancy[index].sErrorText = this.sNoUserValueFind;
     return;
   }
   if (this.bEmployer) {
     this.sNoUserValueFind = 'Работодателям функция "В избранное" для вакансий недоступна.';
     this.myDataVacancy[index].sErrorText = this.sNoUserValueFind;
     return;
   }

   //проверяем нет ли уже такого в фаворитах, если есть то не даем внести
    this.httpService.checkFavoritesVacancy(this.id_user, vcid).subscribe( value => {
      let curV: any = value;
      if (curV.length ===0) {
            this.httpService.postFavoritesVacancy(this.id_user, vcid).subscribe( ()=> {
            this.showFavorites(this.id_user);
            // this.RouterReload()
        });
      } else {
        this.sNoUserValueFind = 'Данная вакансия была занесена ранее.';
        this.myDataVacancy[index].sErrorText = this.sNoUserValueFind;
      }
      });

  }

  unshow($event, index: number, vcid: number) {

    this.sNoUserValueFind = '';
    this.myDataVacancy[index].sErrorText = '';
    if  (!this.bConnected)  {
      this.sNoUserValueFind = 'Для использования функции "Не показывать" пройдите верификацию.';
      this.myDataVacancy[index].sErrorText = this.sNoUserValueFind;
      return;
    }
    if (this.bEmployer) {
      this.sNoUserValueFind = 'Работодателям функция "Не показывать" для вакансий недоступна.';
      this.myDataVacancy[index].sErrorText = this.sNoUserValueFind;
      return;
    }

    this.httpService.postUnshowVacancy(this.id_user, vcid).subscribe( ()=> {
      this.showFavorites(this.id_user);
    });

  }

  response($event, index: number, vcid: number) {

    this.sNoUserValueFind = '';
    this.myDataVacancy[index].sErrorText = '';
    if  (!this.bConnected)  {
      this.sNoUserValueFind = 'Для использования функции "Откликнуться" пройдите верификацию.';
      this.myDataVacancy[index].sErrorText = this.sNoUserValueFind;
      return;
    }
    if (this.bEmployer) {
      this.sNoUserValueFind = 'Работодателям функция "Откликнуться" для вакансий недоступна.';
      this.myDataVacancy[index].sErrorText = this.sNoUserValueFind;
      return;
    }

    this.httpService.getNumberResponse(this.id_user, vcid).subscribe((value: Letter[]) => {

        if (value.length>0) {
            this.sNoUserValueFind = 'Вы уже откликались на данную вакансию. Дождитесь ответа';
            this.myDataVacancy[index].sErrorText = this.sNoUserValueFind;
            } else {
              this.cvEditSrv.setCvId(vcid);
              this.router.navigate(['/response']);
            }
      }) ;
  }

  RouterReload() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.navigated = false;

    this.router.navigate([this.router.url]);
  }

}
