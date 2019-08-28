import {Component, OnDestroy, OnInit} from '@angular/core';
import {City} from '../../../class/City';
import {AuthService} from '../../../services/auth-service.service';
import {Subscription} from 'rxjs';
import {GuideService} from '../../../services/guide-service.service';
import {VacanciesListService} from '../../../services/vacancies-list.service';
import {Router} from '@angular/router';
import {NewVacancyService} from '../../../services/new-vacancy.service';
import {Vacancy} from '../../../class/Vacancy';
import {DatePipe} from '@angular/common';
import {MoveService} from '../../../services/move.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.css']
})
export class VacanciesComponent implements OnInit, OnDestroy {

  contactMethods = [];
  public vacanciesList: any;
  private id_user: number;
  private  bConnected: boolean;
  private sbVacCity: Subscription;
  public  cityList: City[];
  private sbVacanciesGetList: Subscription;
  private sbDeleteVac: Subscription;
  private dvMoveSubscription: Subscription;

  private _numberModel: number;

  public get CvVacanciesItem(): number {
    return this._numberModel;
  }

  public set CvVacanciesItem(a: number) {
    this._numberModel = a;
  }

  onLoadFromBaseAvatar(k: any) {
    k.base64textString = [];

      if (typeof k.Avatar !== 'undefined') {
            if (JSON.parse(k.Avatar) !== null) {
              k.base64textString.push('data:image/png;base64,' + JSON.parse(k.Avatar).value);
          }
      }
  }

  constructor(private authService: AuthService,
              private moveS: MoveService,
              private  gs: GuideService,
              private router: Router,
              private gls: VacanciesListService,
              private nvs: NewVacancyService,
              public translate: TranslateService) { }

  ngOnInit() {

    const Res =  this.authService.loginStorage();
    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;


    this.sbVacCity = this.gs.getCityTable().subscribe((value) => {
      this.cityList = this.authService.loadLangCity(value as City[]);

      this.sbVacanciesGetList = this.gls.getVacanciesList(this.id_user).subscribe((valueVL) => {
          this.vacanciesList = valueVL;

        //обратная сортировка
        this.vacanciesList = this.vacanciesList.sort( (b, a) =>   +new Date(a.DateTimeCreate) - +new Date(b.DateTimeCreate));

        this.vacanciesList.forEach( (vacCur, index) => {
            this.contactMethods.push({'id' : 0, value : 0, 'bDelete': false});

            const sCityName = (this.cityList as City[]).find((valueC) => (valueC.id === parseInt(vacCur.City.toString()) ) ).name;

            this.vacanciesList[index].CityName = sCityName;

          });
        });
    });
  }

  ngOnDestroy() {
    if (typeof  this.sbVacCity !== 'undefined') {
      this.sbVacCity.unsubscribe();
    }

    if (typeof  this.sbVacanciesGetList !== 'undefined') {
      this.sbVacanciesGetList.unsubscribe();
    }

    if (typeof  this.sbDeleteVac !== 'undefined') {
      this.sbDeleteVac.unsubscribe();
    }

    if (typeof this.dvMoveSubscription !== 'undefined') {
      this.dvMoveSubscription.unsubscribe();
    }

  }


  RouterReload() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.navigated = false;

    this.router.navigate([this.router.url]);
  }

  CheckDeleteElement(item: any) {
    item.vacancy.bInvisible = true;

  }


  // редактируем - по факту будем удалять пометкой "удаленное" но оставляя в базе и вписывая новое значение
  EditElement(item: any) {


    //console.log('EditElement item any', item);

    this.gls.setVacId(item.id);
    this.gls.setVacItem(item);
    this.router.navigate(['/vacancy-edit']);
  }

  // просмотр элемента
  DescriptionElement(item: any) {
    this.onLoadFromBaseAvatar(item);
    this.dvMoveSubscription = this.moveS.setDataVacancy(item).subscribe( ()=> this.router.navigate(['/vacancy-description']));
  }



  UnDeleteElement(item: any, i: number) {

    //console.log('item', item);
    item.bInvisible = false;
    this.contactMethods[i].id = 0;
    this.contactMethods[i].bDelete = false;
  }

  // удаляем - по факту ставим признак невидимости элемента
  DeleteElement(item: any) {
    item.bInvisible = true;
    this.sbDeleteVac = this.gls.setDeleteVac(item.id, item).subscribe( () => {
        this.RouterReload();
      },
      err => console.log('there was a problem deleting the item ', err));
  }

  newVac() {
    this.router.navigate(['/new-vacancy']);

  }

  brokerSelected ($event, item, i) {
// TODO СОБЫТИЕ СПИСКА


    //console.log('item brokerSelected',item);

    switch ($event.target.value) {

      case '0': {
        this.contactMethods[i].bDelete = false;
        this.CvVacanciesItem = 0;
        this.contactMethods[i].id = 0;
        break;
      }

      case '1': {
        this.contactMethods[i].bDelete = false;
        this.CvVacanciesItem = 1;
        this.contactMethods[i].id = 1;
        this.DescriptionElement(item);
        break;
      }
      case '2': {
        this.CvVacanciesItem = 2;
        this.contactMethods[i].bDelete = false;
        this.contactMethods[i].id = 2;
        this.EditElement(item);
        break;
      }
      case '3': {
        this.contactMethods[i].bDelete = false;
        this.CvVacanciesItem = 3;
        this.contactMethods[i].id = 3;
        this.copyVAC(item);
        break;
      }
      case '4': {
        this.contactMethods[i].bDelete = true;
        this.contactMethods[i].id = 4;
        this.CvVacanciesItem = 4;
        break;
      }
      default: {
        break;
      }
    }
  }


  /* сохранение данных */
  copyVAC(item) {


    //('MyVac item', item);

    // получаем изначальные данные без динамических блоков
    let MyVac: Vacancy = item;

    let nProm = [];

    if (MyVac.Industry !== null) {
    nProm = MyVac.Industry.toString().split(',');
    MyVac.Industry = nProm;}

    if (MyVac.Schedule !== null) {
    nProm = MyVac.Schedule.toString().split(',');
    MyVac.Schedule = nProm;}

    if (MyVac.Education !== null) {
    nProm = MyVac.Education.toString().split(',');
    MyVac.Education = nProm; }

    if (MyVac.Employment !== null) {
    nProm = MyVac.Employment.toString().split(',');
    MyVac.Employment = nProm;}

    if (MyVac.Experience !== null) {
    nProm = MyVac.Experience.toString().split(',');
    MyVac.Experience = nProm;}

    //const datePipe = new DatePipe('en-US');
    //const currentDate = datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm');
    //MyVac.DateTimeCreate = currentDate;



    this.nvs.postNewVacancy(MyVac).subscribe(
      (value) => {
            this.RouterReload();
          }
        );
  }


}
