import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {City} from '../../../class/City';
import {AuthService} from '../../../services/auth-service.service';
import {Subscription} from 'rxjs';
import {GuideService} from '../../../services/guide-service.service';
import {VacanciesListService} from '../../../services/vacancies-list.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.css']
})
export class VacanciesComponent implements OnInit {

  vacanciesForm: FormGroup;
  protected vacanciesList: any;
  private id_user: number;
  private  bConnected: boolean;
  private sbVacCity: Subscription;
  protected  cityList: City[];
  private sbVacanciesGetList: Subscription;
  private sbDeleteVac: Subscription;

  constructor(private authService: AuthService,
              private  gs: GuideService,
              private router: Router,
              private gls: VacanciesListService) { }

  ngOnInit() {

    var Res =  this.authService.loginStorage();
    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;


    this.sbVacCity = this.gs.getCityTable().subscribe((value) => {
      this.cityList = value as City[];

      console.log('this.id_user',this.id_user);
      console.log('this.cityList',this.cityList);

      this.sbVacanciesGetList = this.gls.getVacanciesList(this.id_user).subscribe((value) =>
        {
          this.vacanciesList = value;

          this.vacanciesList.forEach( (vacCur, index) => {
            let sCityName = (this.cityList as City[]).find((value) => (value.id === vacCur.vacancy.City) ).name;
            this.vacanciesList[index].CityName = sCityName;
          });

        }
      )}
    );


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
    this.sbDeleteVac = this.gls.setDeleteVac(item.id, item.vacancy).subscribe( ()=> {
        console.log('удалили элемент', item.id);
        this.RouterReload();
      },
      err => console.log('при удалении элемента возникла нештатная ситуация ',err));
  }

  newVac() {
    this.router.navigate(['/new-vacancy']);

  }


}
