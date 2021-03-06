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
import {TranslateService} from '@ngx-translate/core';
import {staticGuideList} from '../class/GuideList';
import {GlobalRef} from '../services/globalref';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {


  //home.ts
  sFindNull = ''; //'Поиск не дал результатов.
  sVacF = ''; //'Избранные вакансии'
  sVacEasy = ''; // 'Вакансии'
  sReqVerif = ''; // 'Для использования функции "В избранное" пройдите верификацию.'
  sDeniedFavor = ''; // 'Работодателям функция "В избранное" для вакансий недоступна.'
  sOldInputVac = ''; // 'Данная вакансия была занесена ранее.'
  sUnsowVer = ''; // 'Для использования функции "Не показывать" пройдите верификацию.'
  sEmploeerDeniedUnshow = ''; // 'Работодателям функция "Не показывать" для вакансий недоступна.'
  sResponseVer = ''; // 'Для использования функции "Откликнуться" пройдите верификацию.'
  sEmpoyeerResponseDeny = ''; // 'Работодателям функция "Откликнуться" для вакансий недоступна.'
  sRespSucc = ''; // 'Вы уже откликались на данную вакансию. Дождитесь ответа'



  //заголовок вакансий
  public sVacancy: string;
  // текущая страница
  public page = 1;
  // записей на странице
  public rowPerPage = 5;
  // всего записей после запроса
  public recordsPerAll = 0;

  public bConnected = false;
  private id_user = -1;
  public bEmployer = false;
  public sNoUserValueFind = '';

  myDataVacancy: dataVacancy[];
  allDataVacancy: dataVacancy[];

  private dvSubscription: Subscription;
  private getTableVacancy: Subscription;
  private getTableVacancyAdvanced: Subscription;
  private sbReopenVacancyAdvanced: Subscription;
  private sMask: string = ''


  public bChecked5 = true;
  public bChecked10 = false;
  public bChecked20 = false;
  public bChecked50 = false;

  base64textString = [];

  constructor(
              public gr: GlobalRef,
              private httpService: TableVacancyService,
              private router: Router,
              private moveS: MoveService,
              private authService: AuthService,
              private cvEditSrv: CvEditService,
              private is: GuideService,
              private translate: TranslateService) {

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
  //TODO точка 2

    //console.log('k', k);

    k.base64textString = [];

/*
    if (k.Avatar !== null) {
        if (k.Avatar.toString().length > 0) {
          if (JSON.parse(k.Avatar) !== null) {
            k.base64textString.push('data:image/png;base64,' + JSON.parse(k.Avatar).value);
          }
        }
      }
*/

    if (k.Avatar_Name !== null) {

      if (k.Avatar_Name !== undefined) {

        if (k.Avatar_Name.length > 0) {
          k.sAvatarPath = this.gr.sUrlAvatarGlobal + k.Avatar_Name;
        }
      }
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

//    var encrypted = CryptoJS.SHA256('1234567890');
//    console.log('encrypted',encrypted.toString());


    //console.log('home this.translate.currentLang', this.translate.currentLang);


    this.translate.onTranslationChange.subscribe(value =>
      console.log('OnTranslations Change')
    );

    this.translate.onLangChange.subscribe(value=> {

      //console.log('onLangChange');

      this.translate.get('home.ts.sFindNull').subscribe(
        value => this.sFindNull = value);

      this.translate.get('home.ts.sVacF').subscribe(
        value => {
          this.sVacF = value;
          //console.log('onLangChange this.sVacF', this.sVacF, value);
        }
        );

      this.translate.get('home.ts.sVacEasy').subscribe(
        value => this.sVacEasy = value);

      this.translate.get('home.ts.sReqVerif').subscribe(
        value => this.sReqVerif = value);

      this.translate.get('home.ts.sDeniedFavor').subscribe(
        value => this.sDeniedFavor = value);

      this.translate.get('home.ts.sOldInputVac').subscribe(
        value => this.sOldInputVac = value);

      this.translate.get('home.ts.sUnsowVer').subscribe(
        value => this.sUnsowVer = value);

      this.translate.get('home.ts.sEmploeerDeniedUnshow').subscribe(
        value => this.sEmploeerDeniedUnshow = value);

      this.translate.get('home.ts.sResponseVer').subscribe(
        value => this.sResponseVer = value);

      this.translate.get('home.ts.sEmpoyeerResponseDeny').subscribe(
        value => this.sEmpoyeerResponseDeny = value);

      this.translate.get('home.ts.sRespSucc').subscribe(
        value => this.sRespSucc = value);
      }
    );



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

      if (this.id_user === null) this.id_user = -1;
      this.getVacancy(value, bFavorites, bAdvancedFind);

    });



//todo ВЫЗОВ ИНИЦИАЛИЗАЦИИ ВАКАНСИЙ
///
    if (!this.authService.getForFavorites()) {
      // если не было расширенного поиска вакансий делаем обычный поиск, иначе расширенный запускается из advanced-search.component
      if (this.httpService.getMessageAdvancedFindObj() === null) {

        // запускаем событие "получить вакансии", в первый раз с пустой маской
        this.httpService.triggerReopenVacancy({sMask: this.sMask, isFavorites: false, isAdvancedFind: false});
        // записываем значение маски в элемент, так как при перегрузке страницы он стирается ??????
        this.moveS.setStringFind(this.sMask);
      } else {
        let advancedFindObj = this.httpService.getMessageAdvancedFindObj();
        this.httpService.clearAdvancedFindObj();
        this.getVacancyAdvanced(advancedFindObj);
      }
///
    } else {
      this.authService.setForFavorites(false);
      this.showFavorites(this.id_user);

    }



///
  }

/*
  favorites() {
    // TODO ПОКАЗ ФАВОРИТов 2
    if (this.id_user === null) return;
    //console.log('FAVORITS');
    this.httpTvsService.getFavoritesVacancy(this.id_user).subscribe((favor) =>{

      let s='?&id=-1'; //-1 чтобы иметь пустой курсор в случае отсутствия избранных
      for (let curFavor in favor) {
        s=s+'&id='+favor[curFavor].id_vc;
      }
      window.localStorage.setItem('stringFavorites', s);
      this.getVacancy('',true, false);
    });
  }
*/


  checkIsFull_AdvObj(advancedFindObj: any): boolean {

            if (  advancedFindObj.City.toString() !=='-1' ||
                  advancedFindObj.Education.length>0 ||
                  advancedFindObj.Employment.length>0 ||
                  advancedFindObj.Experience.length>0 ||
                  advancedFindObj.Industry.length>0 ||
                  advancedFindObj.Schedule.length>0 ||
                  advancedFindObj.timePlacementIndex.toString() !== '-1' ||
                  advancedFindObj.Salary.toString() !== '' ||
                  advancedFindObj.stringFind.toString() !== '' ||
                  advancedFindObj.timePlacement.toString() !== '' ||
                  advancedFindObj.timePlacementComment.toString() !== '')  {
                 //console.log('TRUEEEEEE');
                 return true;
               } else {
                 //console.log('FALSEEEEEE');
                 return false;
               }
  }

  //TODO getVacancyAdvanced  ЭТО ПРОДВИНУТЫЙ ПОИСК
  getVacancyAdvanced(advancedFindObj: any) {

    //если есть id_user вствавляем его
    advancedFindObj['id_user']=-1;
    if (this.bConnected) {
      advancedFindObj['id_user'] = this.id_user;
    }
    // выводим всю таблицу по сути это заглушка вместо продвинутого поиска
    //console.log('advancedFindObj', advancedFindObj);
    return this.getTableVacancyAdvanced = this.httpService.getTableVacancyAdvanced(advancedFindObj).subscribe(
      (data: any) => {

//        console.log('getTableVacancyAdvanced', data);
        //console.log('advancedFindObj', advancedFindObj.stringFind );

        this.translate.get('home.ts.sFindNull').subscribe(
          value => {

            this.sFindNull = value;


            //console.log('advancedFindObj',advancedFindObj, 'data.length',data.length);

            //if (advancedFindObj.stringFind !== '' && data.length === 0) {
            if (this.checkIsFull_AdvObj(advancedFindObj) && data.length === 0) {
              this.getVacancy('', false, false);
              this.moveS.startNullFind(this.sFindNull);
              //console.log('this.sFindNull', this.sFindNull);
              return;
            }



            this.data_show(data);
            this.reloadPAge(this.allDataVacancy, advancedFindObj.stringFind);
            this.sVacancy = staticGuideList.all_vac1;
          });

      });
  }

   getVacancy(sMask: string,isFavorites: boolean, isAdvancedFind: boolean) {

    return this.getTableVacancy = this.httpService.getTableVacancy(sMask, this.rowPerPage, this.page, isFavorites, isAdvancedFind, this.id_user).subscribe(
      (data: dataVacancy[]) => {

        //console.log('getTableVacancy', data);


        this.translate.get('home.ts.sFindNull').subscribe(
          value => {

            this.sFindNull = value;
            //если поиск не дал результатов вызываем сами себя с пустой маской
            if (sMask !== '' && data.length === 0) {
              //TODO nenenenenenenenenene
              this.getVacancy('', false, false);
              this.moveS.startNullFind(this.sFindNull);
              //console.log('this.sFindNull',this.sFindNull);
              return;
            }

            this.data_show(data);
            this.reloadPAge(this.allDataVacancy, sMask);
            if (isFavorites) {

              this.translate.get('home.ts.sVacF').subscribe(
                value => {this.sVacF = value;
                              this.sVacancy = this.sVacF;});
            } else {
              this.translate.get('home.ts.sVacEasy').subscribe(
                value => {this.sVacEasy = value;
                              this.sVacancy = this.sVacEasy;});
            }
          });
      });
  }


//TODO показ данных после поиска
  data_show(data: dataVacancy[]) {

    let curRemDay: {numberMonth, errorDay} = {numberMonth: -1, errorDay: true};

    //console.log('1234567890');


    data.forEach(  (curVacancy, index, arrCurValue) => {
        // base64textString = [];

        this.onLoadFromBaseAvatar(curVacancy);
        // ДАТА ОКОНЧАНИЯ ЗАЯВКИ
        curVacancy.sDateEnd = "";
        curVacancy.errorEndDay = true;

        if (typeof curVacancy.DateTimeCreate !== 'undefined') {
          if (typeof curVacancy.DisplayPeriod !== 'undefined') {

            switch(curVacancy.DisplayPeriod) {
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
                curRemDay.numberMonth = 12;
                break;
              }
            }

            ///// высчитываем дату окончания
            // dd/MM/yyyy hh:mm локаль en-US
            if (!curRemDay.errorDay) {

              //console.log('curRemDay', curRemDay);

              var dateObject = this.StrToDate(curVacancy.DateTimeCreate);
              let DateEnd = new Date(dateObject.setMonth(dateObject.getMonth() + curRemDay.numberMonth));
              var datePipe = new DatePipe("en-US");
              curVacancy.sDateEnd =  datePipe.transform(DateEnd, 'dd.MM.yyyy');
              curVacancy.errorEndDay = false;
            }
          }
        }

      }
    );

    this.myDataVacancy = data;
    this.sortByDueDate();

    this.allDataVacancy = data;
    this.recordsPerAll = data.length;
    this.is.startCheckPaginator({value1: this.recordsPerAll, value2: this.rowPerPage});


  }




  public StrToDate(curStrDate: string): Date {


//    const reggie = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/;
//    const dateArray = reggie.exec(curStrDate);
//    const dateObject = new Date(+dateArray[3], +dateArray[2] - 1, +dateArray[1], +dateArray[4], +dateArray[5], 0, 0);

    const dateObject = new Date(curStrDate);

    return dateObject;
  }



  public sortByDueDate(): void {

    this.myDataVacancy.sort((a, b) => {
      const d1 = this.StrToDate(a.DateTimeCreate);
      const d2 = this.StrToDate(b.DateTimeCreate);
     // console.log('d1',d1,'d2',d2, 'a', a['vacancy'].DateTimeCreate, 'b', b['vacancy'].DateTimeCreate);
      return d2.getTime() - d1.getTime();
    });
  }

  // получаем из массива кол. записей и кусок записей на данной странице
  reloadPAge(data: dataVacancy[], sMask: string) {


    //console.log('старая data', data);
    //console.log('this.rowPerPage', this.rowPerPage, 'this.page', this.page);
    data = data.slice(this.rowPerPage*(this.page-1),this.rowPerPage*(this.page-1)+this.rowPerPage);
    //console.log('новая data', data);


    // это получаем город из нового вызываемого сервиса
    this.httpService.getCity().subscribe((city: City[]) => {

      //console.log('CITY', city);

        data.forEach((eekey, ih) => {

            let idCity = eekey.City;
            if (isNullOrUndefined(idCity) === false) {
                let CurCity = city.find(x => x.id === parseInt(idCity.toString()));
                let curL = this.authService.getLangStorage();
                if (typeof curL === 'undefined') { eekey.CityName = CurCity.name;}
                if (curL ===0 ) eekey.CityName = CurCity.name;
                if (curL ===1 ) eekey.CityName = CurCity.nameEx1;
                if (curL ===2 ) eekey.CityName = CurCity.nameEx2;
            }
          }

        );

        //this.myDataVacancy = data.sort( (a, b)=> b['vacancy'].DateTimeCreate - a['vacancy'].DateTimeCreate );;
/*
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
*/
        window.localStorage.removeItem('backPage');


// TODO добавили в новом коде
      this.myDataVacancy = data;

      }

    );

  }


  MyMethod(zid: number, $event) {

    if ($event.target.id === 'vcresponse' ||
      $event.target.id === 'vcfavorites' ||
      $event.target.id === 'vchide' ||
      $event.target.id === 'vcresponseDisabled' ||
      $event.target.id === 'vcfavoritesDisabled' ||
      $event.target.id === 'vchideDisabled')
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

    if (typeof this.getTableVacancyAdvanced !== 'undefined') {
      this.getTableVacancyAdvanced.unsubscribe();
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

    this.translate.get('home.ts.sVacEasy').subscribe(
      value => {
        this.sVacEasy = value;
        this.sVacancy = this.sVacEasy;
      });

   this.sNoUserValueFind = '';
    this.myDataVacancy[index].sErrorText = '';
   if  (!this.bConnected) {
     this.sNoUserValueFind = this.sReqVerif;
     this.myDataVacancy[index].sErrorText = this.sNoUserValueFind;
     return;
   }
   if (this.bEmployer) {
     this.sNoUserValueFind = this.sDeniedFavor;
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
        this.sNoUserValueFind = this.sOldInputVac;
        this.myDataVacancy[index].sErrorText = this.sNoUserValueFind;
      }
      });

  }



  unshow($event, index: number, vcid: number) {

    this.sNoUserValueFind = '';
    this.myDataVacancy[index].sErrorText = '';
    if  (!this.bConnected)  {
      this.sNoUserValueFind = this.sUnsowVer;
      this.myDataVacancy[index].sErrorText = this.sNoUserValueFind;
      return;
    }
    if (this.bEmployer) {
      this.sNoUserValueFind = this.sEmploeerDeniedUnshow;
      this.myDataVacancy[index].sErrorText = this.sNoUserValueFind;
      return;
    }

    this.httpService.postUnshowVacancy(this.id_user, vcid).subscribe( ()=> {

      let CurVacancy = this.myDataVacancy.find(x => x.id === parseInt(vcid.toString()));
      this.myDataVacancy.splice(this.myDataVacancy.indexOf(CurVacancy), 1);

      //TODO this.showFavorites
     // this.showFavorites(this.id_user);


    });

  }


  response(index: number, vcid: number) {

        this.sNoUserValueFind = '';
        this.myDataVacancy[index].sErrorText = '';
        if  (!this.bConnected)  {
          this.sNoUserValueFind = this.sResponseVer;
          this.myDataVacancy[index].sErrorText = this.sNoUserValueFind;
          return;
        }

        if (this.bEmployer) {
          this.sNoUserValueFind = this.sEmpoyeerResponseDeny;
          this.myDataVacancy[index].sErrorText = this.sNoUserValueFind;
          return;
        }


    this.translate.get('home.ts.sRespSucc').subscribe(resRespSucc => {
      this.sRespSucc = resRespSucc;
      this.httpService.getNumberResponse(this.id_user, vcid).subscribe((value: Letter[]) => {
        if (value.length > 0) {
          this.sNoUserValueFind = this.sRespSucc;
          //console.log('!!!!!!!!!!!!!!!!!!!!!!this.sNoUserValueFind', this.sNoUserValueFind);
          this.myDataVacancy[index].sErrorText = this.sNoUserValueFind;
        } else {
          this.cvEditSrv.setCvId(vcid);
          this.router.navigate(['/response']);
        }
      });
    });

  }

  RouterReload() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.navigated = false;

    this.router.navigate([this.router.url]);
  }

}
