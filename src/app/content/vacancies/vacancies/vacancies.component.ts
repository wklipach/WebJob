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

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.css']
})
export class VacanciesComponent implements OnInit, OnDestroy {

  contactMethods = [];
  protected vacanciesList: any;
  private id_user: number;
  private  bConnected: boolean;
  private sbVacCity: Subscription;
  protected  cityList: City[];
  private sbVacanciesGetList: Subscription;
  private sbDeleteVac: Subscription;

  private _numberModel: number;

  protected get CvVacanciesItem(): number {
    return this._numberModel;
  }

  protected set CvVacanciesItem(a: number) {
    this._numberModel = a;
  }


  constructor(private authService: AuthService,
              private  gs: GuideService,
              private router: Router,
              private gls: VacanciesListService,
              private nvs: NewVacancyService) { }

  ngOnInit() {

    const Res =  this.authService.loginStorage();
    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;


    this.sbVacCity = this.gs.getCityTable().subscribe((value) => {
      this.cityList = value as City[];

      console.log('this.id_user',  this.id_user);
      console.log('this.cityList', this.cityList);

      this.sbVacanciesGetList = this.gls.getVacanciesList(this.id_user).subscribe((valueVL) => {
          this.vacanciesList = valueVL;




          this.vacanciesList.forEach( (vacCur, index) => {
            this.contactMethods.push({'id' : 0, value : 0, 'bDelete': false});
            const sCityName = (this.cityList as City[]).find((valueC) => (valueC.id === vacCur.vacancy.City) ).name;
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

    this.gls.setVacId(item.id);
    this.gls.setVacItem(item.vacancy);
    this.router.navigate(['/vacancy-edit']);
  }



  UnDeleteElement(item: any) {
    item.vacancy.bInvisible = false;
  }

  // удаляем - по факту ставим признак невидимости элемента
  DeleteElement(item: any) {
    item.vacancy.bInvisible = true;
    this.sbDeleteVac = this.gls.setDeleteVac(item.id, item.vacancy).subscribe( () => {
        console.log('удалили элемент', item.id);
        this.RouterReload();
      },
      err => console.log('при удалении элемента возникла нештатная ситуация ', err));
  }

  newVac() {
    this.router.navigate(['/new-vacancy']);

  }

  brokerSelected ($event, item, i) {
// TODO СОБЫТИЕ СПИСКА
    switch ($event.target.value) {

      case '0': {
        this.contactMethods[i].bDelete = false;
        this.CvVacanciesItem = 0;
        this.contactMethods[i].id = 0;
        console.log('!!!!this.contactMethods', this.contactMethods);
        break;
      }

      case '1': {
        this.contactMethods[i].bDelete = false;
        this.CvVacanciesItem = 1;
        this.contactMethods[i].id = 1;
        console.log('!!!!this.contactMethods', this.contactMethods);
        console.log('просмотр');
        break;
      }
      case '2': {
        this.CvVacanciesItem = 2;
        this.contactMethods[i].bDelete = false;
        this.contactMethods[i].id = 2;
        console.log('!!!!this.contactMethods', this.contactMethods);
        this.EditElement(item);
        break;
      }
      case '3': {
        this.contactMethods[i].bDelete = false;
        this.CvVacanciesItem = 3;
        this.contactMethods[i].id = 3;
        this.copyVAC(item);
        console.log('Создать копию');
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

    // получаем изначальные данные без динамических блоков
    const MyVac: Vacancy = item.vacancy;

    const datePipe = new DatePipe('en-US');
    const currentDate = datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm');
    MyVac.DateTimeCreate = currentDate;
    this.nvs.postNewVacancy(MyVac).subscribe(
      (value) => {
            this.RouterReload();
          }
        );
  }


}
