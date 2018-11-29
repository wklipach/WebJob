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




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  //текущая страница
  public page = 1;
  //записей на странице
  public rowPerPage = 5;
  //всего записей после запроса
  public recordsPerAll = 0;

  private bConnected = false;
  private id_user = -1;
  private bEmployer = false;
  public sNoUserValueFind = '';

  /* TODO First myDataVacancy   */
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
    console.log('передаем число записей на страницу', this.rowPerPage);
    this.is.startCheckPaginator({value1: this.recordsPerAll, value2: this.rowPerPage});
    console.log('всего записей', this.recordsPerAll);
    this.reloadPAge(this.allDataVacancy, this.sMask);

  }


  onPageChanged(pageNumber: number) {
    console.log('переключили страницу, новая страница=', pageNumber);
    this.reloadPAge(this.allDataVacancy, this.sMask);
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
    }

    this.funcCheckedFind(this.rowPerPage);


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


    // TODO getVacancy
   getVacancy(sMask: string) {
    return this.getTableVacancy = this.httpService.getTableVacancy(sMask, this.rowPerPage, this.page).subscribe(
      (data: dataVacancy[]) => {

        this.myDataVacancy = data;
        this.allDataVacancy = data;
        this.recordsPerAll = data.length;
        this.is.startCheckPaginator({value1: this.recordsPerAll, value2: this.rowPerPage});
        console.log('всего записей', this.recordsPerAll);
        this.reloadPAge(this.allDataVacancy, sMask);

     }
    );
  }


  //получаем из массива кол. записей и кусок записей на данной странице
  reloadPAge(data: dataVacancy[], sMask: string) {

    console.log('this.rowPerPage*(this.page-1)',this.rowPerPage*(this.page-1),'this.rowPerPage',this.rowPerPage);
    console.log('DATA1', data);
    data = data.slice(this.rowPerPage*(this.page-1),this.rowPerPage*(this.page-1)+this.rowPerPage);
    console.log('DATA2', data);
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

        // TODO 2 this.myDataVacancy

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
              this.getVacancy('');
              this.moveS.startNullFind('Поиск не дал результатов.');
            }
          }
        }
        window.localStorage.removeItem('backPage');

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

    // TODO 3 myDataVacancy
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

    //TODO 4 this.myDataVacancy

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

    //TODO 5 this.myDataVacancy

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

    // TODO 6 this.myDataVacancy

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

