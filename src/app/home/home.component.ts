import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableVacancyService} from '../services/table-vacancy.service';
import {dataVacancy} from '../class/Vacancy';
import {City} from '../class/City';
import {isNullOrUndefined} from 'util';
import {Router} from '@angular/router';
import {MoveService} from '../services/move.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  myDataVacancy: dataVacancy[];
  private dvSubscription: Subscription;
  private getTableVacancy: Subscription;
  private sMask: string = '';

  constructor(private httpService: TableVacancyService, private router: Router, private moveS: MoveService) {
  }

  ngOnInit() {

    if (window.localStorage.getItem('keyFind') !== null) {
      this.sMask = window.localStorage.getItem('keyFind');
    }
    window.localStorage.removeItem('keyFind');
    //
    this.httpService.onReopenVacancy.subscribe((value: string) => this.getVacancy(value));
    // запускаем событие "получить вакансии", в первый раз с пустой маской
    this.httpService.triggerReopenVacancy(this.sMask);
    // записываем значение маски в элемент, так как при перегрузке страницы он стирается ??????
    this.moveS.setStringFind(this.sMask);

  }

  getVacancy(sMask: string) {
    return this.getTableVacancy = this.httpService.getTableVacancy(sMask).subscribe(
      (data: dataVacancy[]) => {

        // это получаем город из нового вызываемого сервиса
        this.httpService.getCity().subscribe((city: City[]) => {

            data.forEach((eekey, ih) => {

              let idCity = eekey['vacancy'].City;
              if (isNullOrUndefined(idCity) === false) {
                let CurCity = city.find(city => city.id === idCity);
                eekey.CityName = CurCity.name;
              }
            });
            this.myDataVacancy = data;
            if (this.myDataVacancy.length === 0) {

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
                  this.getVacancy('');
                  this.moveS.startNullFind('Поиск не дал результатов.');
                }
              }
            }
            window.localStorage.removeItem('backPage');

          }
        );
     }
    );
  }


  MyMethod(zid: number) {
    // console.log('id--', zid);
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

  }

}

