import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableVacancyService} from '../services/table-vacancy.service';
import {dataVacancy} from '../class/Vacancy';
import {City} from '../class/City';
import {isNullOrUndefined} from 'util';
import {Router} from '@angular/router';
import {MoveService} from '../services/move.service';
import {Subscription} from 'rxjs';
import {AppComponent} from '../app.component';
import {AuthService} from '../services/auth-service.service';
import {CvEditService} from '../services/cv-edit.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private bConnected = false;
  private id_user = -1;
  private bEmployer = false;
  public sNoUserValueFind = '';
  myDataVacancy: dataVacancy[];
  private dvSubscription: Subscription;
  private getTableVacancy: Subscription;
  private sbReopenVacancyAdvanced: Subscription;
  private sMask: string = '';

  constructor(private httpService: TableVacancyService,
              private router: Router,
              private moveS: MoveService,
              private authService: AuthService,
              private cvEditSrv: CvEditService) {
  }

  ngOnInit() {

    var Res =  this.authService.loginStorage();
    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;
    this.bEmployer = Res.bEmployer;

    if (window.localStorage.getItem('keyFind') !== null) {
      this.sMask = window.localStorage.getItem('keyFind');
    }
    window.localStorage.removeItem('keyFind');


    this.httpService.onReopenVacancy.subscribe((value: string) => this.getVacancy(value));



    //если не было расширенного поиска вакансий делаем обычный поиск, иначе расширенный запускается из advanced-search.component
    if ( this.httpService.getMessageAdvancedFindObj() === null ) {
      // запускаем событие "получить вакансии", в первый раз с пустой маской
      this.httpService.triggerReopenVacancy(this.sMask);
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
    console.log ('событие вызвало перемещение объекта', advancedFindObj);

    //выводим всю таблицу по сути это заглушка вместо продвинутого поиска
    this.getVacancy('');
  }



   getVacancy(sMask: string) {
    return this.getTableVacancy = this.httpService.getTableVacancy(sMask).subscribe(
      (data: dataVacancy[]) => {

        console.log('DATA');
        console.log(data);

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


  MyMethod(zid: number, $event) {


    console.log ('$event.explicitOriginalTarget.id', $event.explicitOriginalTarget.id);

    if ($event.explicitOriginalTarget.id === 'vcresponse' ||
        $event.explicitOriginalTarget.id === 'vcfavorites' ||
        $event.explicitOriginalTarget.id === 'vchide')
    return;

    console.log('id--', zid);
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

  favorites($event, index: number, vcid: number) {

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

    console.log('избранное', 'vcid', vcid);
    this.httpService.postFavoritesVacancy(this.id_user, vcid).subscribe( ()=> this.RouterReload());


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

    console.log('не показывать');
    this.httpService.postUnshowVacancy(this.id_user, vcid).subscribe( ()=> this.RouterReload());

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
    console.log('ответить');

    this.cvEditSrv.setCvId(vcid);
    this.router.navigate(['/response']);

  }

  RouterReload() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.navigated = false;

    this.router.navigate([this.router.url]);
  }

}

