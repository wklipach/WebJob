import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth-service.service';
import {dataCV} from '../../../class/CV';
import {TableVacancyService} from '../../../services/table-vacancy.service';
import {dataVacancy} from '../../../class/Vacancy';
import {Subscription} from 'rxjs';
import {GuideService} from '../../../services/guide-service.service';
import {isNullOrUndefined} from "util";
import {City} from '../../../class/City';
import {Router} from '@angular/router';
import {MoveService} from '../../../services/move.service';
import {DatePipe} from '@angular/common';
import {CvEditService} from '../../../services/cv-edit.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-cvhome',
  templateUrl: './cvhome.component.html',
  styleUrls: ['./cvhome.component.css']
})
export class CvhomeComponent implements OnInit {

  //cvhome.ts.
  sUseResp = ''; // 'Вы уже посылали приглашение на данное резюме.'
  sNullFund = ''; // 'Поиск не дал результатов.'
  sFavCV = ''; //  'Избранные резюме'
  sCV_Tr = ''; //  'Резюме'



  // заголовок вакансий
  private _listCity: City[] = [];
  public sCV: string;
  private bConnected = false;
  private id_user = -1;
  private bEmployer = false;
  protected myDataCV: dataCV[];
  protected allDataCV: dataCV[];

  protected bChecked5 = true;
  protected bChecked10 = false;
  protected bChecked20 = false;
  protected bChecked50 = false;
  private sMask: string = '';
  private getTableCV: Subscription;
  private getTableCVAdvanced: Subscription;
  private dvSubscVacancy: Subscription;
  // текущая страница
  public page = 1;
  // записей на странице
  public rowPerPage = 5;
  // всего записей после запроса
  public recordsPerAll = 0;

  constructor(private authService: AuthService,
              private httpService: TableVacancyService,
              private is: GuideService,
              private router: Router,
              private moveS: MoveService,
              private cveditserv: CvEditService,
              private httpTvsService: TableVacancyService,
              private translate: TranslateService) { }

  ngOnInit() {


    this.translate.onLangChange.subscribe(value=> {

      this.translate.get('cvhome.ts.sUseResp').subscribe(
        value => this.sUseResp = value);

      this.translate.get('cvhome.ts.sNullFund').subscribe(
        value => this.sNullFund = value);

      this.translate.get('cvhome.ts.sFavCV').subscribe(
        value => this.sFavCV = value);

      this.translate.get('cvhome.ts.sCV_Tr').subscribe(
        value => this.sCV_Tr = value);

    });


    console.log('constructor cvhome');

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


    var Res =  this.authService.loginStorage();
    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;
    this.bEmployer = Res.bEmployer;
    this.funcCheckedFind(this.rowPerPage);

    if (window.localStorage.getItem('keyFind') !== null) {
      this.sMask = window.localStorage.getItem('keyFind');
    }


    console.log('cv this.sMask',this.sMask);

    window.localStorage.removeItem('keyFind');
    this.httpService.onReopenCV.subscribe(({sMask: value, isFavorites: bFavorites, isAdvancedFind: bAdvancedFind }) => {
      this.getCV(value, bFavorites, bAdvancedFind);
    });



    // _messageAdvancedFindObj
    // если не было расширенного поиска вакансий делаем обычный поиск, иначе расширенный запускается из advanced-search.component
    if ( this.httpService.getMessageAdvancedFindObj() === null ) {

      // запускаем событие "получить резюме", в первый раз
      this.httpTvsService.triggerReopenCV( {sMask: this.sMask, isFavorites: false, isAdvancedFind: false} );
      // записываем значение маски в элемент, так как при перегрузке страницы он стирается ??????
      this.moveS.setStringFind(this.sMask);
    } else
    {
      let advancedFindObj = this.httpService.getMessageAdvancedFindObj();
      this.httpService.clearAdvancedFindObj();
      this.getCVAdvanced(advancedFindObj);
    }


  }

  // TODO getVacancyAdvanced  ЭТО ПРОДВИНУТЫЙ ПОИСК
  getCVAdvanced(advancedFindObj: any) {
    // если есть id_user вствавляем его
    advancedFindObj['id_user']=-1;
    if (this.bConnected) {
      advancedFindObj['id_user'] = this.id_user;
    }
    // выводим всю таблицу по сути это заглушка вместо продвинутого поиска
    console.log('advancedFindObj CV', advancedFindObj);
    return this.getTableCVAdvanced = this.httpService.getTableCVAdvanced(advancedFindObj).subscribe(
      (data: any) => {


        //console.log('после продвинутого поиска', data );

        this.data_show(data);
        this.reloadPAge(this.allDataCV, advancedFindObj.stringFind);
        this.sCV = this.sCV_Tr;
      });
  }

// todo GETCV
  getCV(sMask: string, isFavorites: boolean, isAdvancedFind: boolean) {
    return this.getTableCV = this.httpService.getTableCV(sMask, this.rowPerPage, this.page, isFavorites, isAdvancedFind, this.id_user).subscribe(
      (data: any) => {

        this.translate.get('cvhome.ts.sNullFund').subscribe(
          value => {
            this.sNullFund = value;
            // если поиск не дал результатов вызываем сами себя с пустой маской
            if (sMask !== '' && data.length === 0) {
              this.getCV('', false, false);
              this.moveS.startNullFind(this.sNullFund);
              console.log('cv neneneneneenene startNullFind', this.sNullFund);
              return;
            }

            this.data_show(data);
            this.reloadPAge(this.allDataCV, sMask);
            if (isFavorites) this.sCV = this.sFavCV; else this.sCV = this.sCV_Tr;
          });
      });
  }

  onPageChanged(pageNumber: number) {

    this.reloadPAge(this.allDataCV, this.sMask);
  }

  response(index: number, cvid: number) {

   this.myDataCV[index].sErrorText = '';
    this.httpService.getCheckInvite(cvid, this.id_user, this.id_user).subscribe( (res) => {

      if (res[0].Res === 0) {
        this.dvSubscVacancy = this.moveS.setInvestCVID(cvid).subscribe(() => {
          this.router.navigate(['/invitation']);
        });
      } else {
        console.log('this.sUseResp', this.sUseResp);

        this.translate.get('cvhome.ts.sUseResp').subscribe(
          value => {
               this.sUseResp = value;
              this.myDataCV[index].sErrorText = this.sUseResp;});
      }
    }
  );

    console.log('invitation');
  }

  MyMethod(zid: number, $event) {
    console.log('MyMethod', $event);

    // если это кнопка Пригласить запрещаем открывать просмотр
    if ($event.target.id === 'cvresponse')   return;

//    let cv = this.myDataCV.find(cv =>  cv.id===zid);

    this.cveditserv.getAnyCv(zid).subscribe(item =>{
      this.cveditserv.setCvId(item[0].id);

      if (isNullOrUndefined(item[0].City) === false) {
        let CurCity = this._listCity.find(x => x.id === parseInt(item[0].City.toString()));
        item[0].CityName = CurCity.name;
      }

      this.cveditserv.setCvItem(item[0]);
      this.router.navigate(['/cv-view']);
    });

  }







  private funcCheckedFind(nPageNumber: number)   {

    this.bChecked5 = false;
    this.bChecked10 = false;
    this.bChecked20 = false;
    this.bChecked50 = false;

    if (nPageNumber === 5)   this.bChecked5 = true;
    if (nPageNumber === 10)  this.bChecked10 = true;
    if (nPageNumber === 20)  this.bChecked20 = true;
    if (nPageNumber === 50)  this.bChecked50 = true;
    if (!this.bChecked5 && !this.bChecked10 && !this.bChecked20 && !this.bChecked50) this.bChecked5 = true;
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
    this.reloadPAge(this.allDataCV, this.sMask);

  }

  // получаем из массива кол. записей и кусок записей на данной странице
  reloadPAge(data: dataCV[], sMask: string) {

    if (data === undefined)  data = [];

    console.log('старая data', data);
    console.log('this.rowPerPage', this.rowPerPage, 'this.page', this.page);


      data = data.slice(this.rowPerPage * (this.page - 1), this.rowPerPage * (this.page - 1) + this.rowPerPage);
      console.log('новая data', data);



    // это получаем город из нового вызываемого сервиса
    this.httpService.getCity().subscribe((city: City[]) => {

        city = this.authService.loadLangCity(city);
        this._listCity = city;
        console.log('CITY', city);



        data.forEach((eekey, ih) => {

            let idCity = eekey.City;
            if (isNullOrUndefined(idCity) === false) {
              let CurCity = city.find(x => x.id === parseInt(idCity.toString()));
              eekey.CityName = CurCity.name;
            }
          }

        );

        if (this.allDataCV === undefined)  this.allDataCV = [];

/*
        if (this.allDataCV.length === 0) {
//todo ПОИСК не нашли
          if (window.localStorage.getItem('backPage') !== null) {
            let sBack = window.localStorage.getItem('backPage');
            window.localStorage.removeItem('backPage');
            if (sBack !== '/' && sBack !== '/smain') {
              this.router.navigateByUrl(sBack);
              this.moveS.setNullValueFind('Поиск не дал результатов.');
            }
            if ((sBack === '/' || sBack === '/smain') && sMask !== '')  {

              this.sMask = '';
              //this.getCV('',false,false);
              console.log('перед navigateByUrl', sBack);
              //this.router.navigateByUrl(sBack);
              this.router.navigate(['/']);
              console.log('после navigateByUrl', sBack);
              this.moveS.startNullFind('Поиск не дал результатов.');
            }
          }
          return;
        }
*/

        window.localStorage.removeItem('backPage');
        this.myDataCV = data;
      }

    );

  }

//TODO показ данных после поиска
  data_show(data: any) {

    // dataCV[]
  if (data !== null) {
    data.forEach((curCV, index, arrCurValue) => {

      //console.log('curCV', curCV);

      this.onLoadFromBaseAvatar(curCV);
    });


    this.myDataCV = data;
    console.log('this.myDataCV',this.myDataCV);
    this.allDataCV = data;
    this.recordsPerAll = data.length;
  }

    this.is.startCheckPaginator({value1: this.recordsPerAll, value2: this.rowPerPage});
  }

  onLoadFromBaseAvatar(k: any) {
    // TODO точка 2
    k.base64textString = [];

    if (k.Avatar !== null) {
      if (k.Avatar.toString().length > 0) {
        if (JSON.parse(k.Avatar) !== null) {
        k.base64textString.push('data:image/png;base64,' + JSON.parse(k.Avatar).value);
        }
      }
    }
  }


  ngOnDestroy() {

    if (typeof this.dvSubscVacancy !== 'undefined') {
      this.dvSubscVacancy.unsubscribe();
    }

     if (typeof this.getTableCV !== 'undefined') {
          this.getTableCV.unsubscribe();
      }

    if (typeof this.getTableCVAdvanced !== 'undefined') {
      this.getTableCVAdvanced.unsubscribe();
    }
  }

}
