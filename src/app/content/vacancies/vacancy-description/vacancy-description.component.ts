import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {dataVacancy} from '../../../class/Vacancy';
import {MoveService} from '../../../services/move.service';
import {GuideService} from '../../../services/guide-service.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../services/auth-service.service';
import {Letter} from '../../../class/Letter';
import {CvEditService} from '../../../services/cv-edit.service';
import {TableVacancyService} from '../../../services/table-vacancy.service';
import {Guide} from '../../../class/guide';
import {VacanciesListService} from '../../../services/vacancies-list.service';
import {staticGuideList} from '../../../class/GuideList';

@Component({
  selector: 'app-vacancy-description',
  templateUrl: './vacancy-description.component.html',
  styleUrls: ['./vacancy-description.component.css']
})
export class VacancyDescriptionComponent implements OnInit {

  descrDataVacancy: dataVacancy;
  private bConnected = false;
  private id_user = -1;
  private bEmployer = false;
  public sNoUserValueFind = '';



  //период показа
  displayPeriodList: Guide[];
  //адрес вакансии
  sAddress: string = '';
  sEmployerUserName: string = '';

  // отрасль
  sIndusrtry: string[] = [];
  // график работы
  sSchedule: string[] = [];
  // занятость
  sEmployment: string[] = [];
  // образование
  sEducation: string[] = [];
  // опыт работы
  sExperience: string[] = [];

  //период показа
  sDisplayPeriod: string[] = [];

  private dvSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private moveS: MoveService,
              private sGuide: GuideService,
              private router: Router,
              private authService: AuthService,
              private httpService: TableVacancyService,
              private cvEditSrv: CvEditService,
              private vcListServ: VacanciesListService) { }


  ngOnInit() {


//    let genderList = staticGuideList.GenderList;
//    console.log('genderList', genderList);


    var Res =  this.authService.loginStorage();
      this.bConnected = Res.bConnected;
      this.id_user =  Res.id_user;
      this.bEmployer = Res.bEmployer;

      this.displayPeriodList = this.sGuide.getDisplayPeriodList();

      this.dvSubscription = this.moveS.getDataVacancy()
      .subscribe (curDataVacancy =>
      {
        console.log('curDataVacancy', curDataVacancy);

        //получаем объект из кэша, если неполный - делаем запрос к серверу и получаем новый getVacAny(id_vc: number)
        if (curDataVacancy === undefined) {
          this.router.navigate(['/smain']);
          return;
        }

        //получаем объект из кэша, если неполный - делаем запрос к серверу и получаем новый getVacAny(id_vc: number)
        if (curDataVacancy.Industry || curDataVacancy.Education || curDataVacancy.Employment || curDataVacancy.Experience)
        {
          this.descrDataVacancy = curDataVacancy;
          this.onLoadUserData(this.descrDataVacancy);
          this.LoadAdvData();
        } else
        {
          this.vcListServ.getVacAny(curDataVacancy.id).subscribe(qcurDataVacancy => {
            this.descrDataVacancy = qcurDataVacancy[0];
            this.onLoadUserData(this.descrDataVacancy);
            this.LoadAdvData();
            this.onLoadFromBaseAvatar(this.descrDataVacancy);
            //console.log('asRES', this.descrDataVacancy);
            //if (qcurDataVacancy[0].Avatar === null) this.descrDataVacancy.base64textString = [];
            //  else this.descrDataVacancy.base64textString = qcurDataVacancy[0].Avatar;
          });
        }

      }, error => { console.log('DescriptionError', error); this.router.navigate(['/smain']); } );

//    if (typeof this.descrDataVacancy === 'undefined') {
//      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
//      this.router.navigate(['/smain']);
//    }

  }


  onLoadFromBaseAvatar(k: any) {
    //TODO точка 2
    k.base64textString = [];

    if (k.Avatar !== null) {
      if (k.Avatar.toString().length > 0) k.base64textString.push('data:image/png;base64,' + JSON.parse(k.Avatar).value);
    }
  }

  onLoadUserData(k: any) {
    if (typeof k.id_user !== 'undefined') {
      this.authService.getDataUserFromId(k.id_user).subscribe((aRes) => {
        if (aRes!= undefined) {
          this.sAddress = aRes[0].Address;
          this.sEmployerUserName = aRes[0].UserName;
        }
      });
    }

  }


  LoadAdvData() {
    // отрасль
    if (typeof this.descrDataVacancy.Industry !== 'undefined' && this.descrDataVacancy.Industry !== null) {
      const sInd = this.descrDataVacancy.Industry.toString().split(',');
      sInd.forEach( intIndustry => this.sIndusrtry.push(this.sGuide.getIndustryName(Number(intIndustry)) ) );
    }

    // график работы
    if (typeof this.descrDataVacancy.Schedule !== 'undefined' && this.descrDataVacancy.Schedule !== null) {
      const sSch = this.descrDataVacancy.Schedule.toString().split(',');
      sSch.forEach( intSchedule => this.sSchedule.push(this.sGuide.getScheduleName(Number(intSchedule)) ) );
    }

    // занятость
    if (typeof this.descrDataVacancy.Employment !== 'undefined' && this.descrDataVacancy.Employment !== null) {
      const sEmpl = this.descrDataVacancy.Employment.toString().split(',');
      sEmpl.forEach( intEmployment => this.sEmployment.push(this.sGuide.getEmploymentName(Number(intEmployment))) );
    }

    // образование
    if (typeof this.descrDataVacancy.Education !== 'undefined' && this.descrDataVacancy.Education !== null) {
      const sEduc = this.descrDataVacancy.Education.toString().split(',');
      sEduc.forEach( intEducation => this.sEducation.push(this.sGuide.getEducationName(Number(intEducation)) ) );
    }

    // опыт работы
    if (typeof this.descrDataVacancy.Experience !== 'undefined' && this.descrDataVacancy.Experience !== null) {
      const sExper = this.descrDataVacancy.Experience.toString().split(',');
      sExper.forEach( intExperience => this.sExperience.push(this.sGuide.getExperienceName(Number(intExperience))));
    }

    // период показа
    if (typeof this.descrDataVacancy.DisplayPeriod !== 'undefined' && this.descrDataVacancy.DisplayPeriod !== null) {
      const sDPeriod = this.descrDataVacancy.DisplayPeriod.toString().split(',');
      sDPeriod.forEach( intDisplayPeriod => this.sDisplayPeriod.push(this.sGuide.getExperienceName(Number(intDisplayPeriod))));
    }

  }

  clickAboutCompany() {
    window.localStorage.setItem('about_user', this.descrDataVacancy.id_user.toString());
    this.router.navigate(['/about-company']);
  }


  ngOnDestroy() {

    if (typeof this.dvSubscription !== 'undefined') {
      this.dvSubscription.unsubscribe();
    }

  }

  vcFavour() {
    // TODO ПОСТИНГ ФАВОРИТОВ
    this.sNoUserValueFind = '';
    this.descrDataVacancy.sErrorText = '';
    if  (!this.bConnected) {
      this.sNoUserValueFind = 'Для использования функции "В избранное" пройдите верификацию.';
      this.descrDataVacancy.sErrorText = this.sNoUserValueFind;
      return;
    }
    if (this.bEmployer) {
      this.sNoUserValueFind = 'Работодателям функция "В избранное" для вакансий недоступна.';
      this.descrDataVacancy.sErrorText = this.sNoUserValueFind;
      return;
    }

    //проверяем нет ли уже такого в фаворитах, если есть то не даем внести
    this.httpService.checkFavoritesVacancy(this.id_user, this.descrDataVacancy.id).subscribe( value => {
      let curV: any = value;
      if (curV.length ===0) {
        this.httpService.postFavoritesVacancy(this.id_user, this.descrDataVacancy.id).subscribe( ()=> {
          this.sNoUserValueFind = 'Данная вакансия успешно занесена в избранные.';
        });
      } else {
        this.sNoUserValueFind = 'Данная вакансия была занесена ранее.';
        this.descrDataVacancy.sErrorText = this.sNoUserValueFind;
      }
    });
  }




  vcResponse() {

    console.log('vcResponse', this.descrDataVacancy);
    this.sNoUserValueFind = '';
    this.descrDataVacancy.sErrorText = '';
    if  (!this.bConnected)  {
      this.sNoUserValueFind = 'Для использования функции "Откликнуться" пройдите верификацию.';
      this.descrDataVacancy.sErrorText = this.sNoUserValueFind;
      return;
    }

    if (this.bEmployer) {
      this.sNoUserValueFind = 'Работодателям функция "Откликнуться" для вакансий недоступна.';
      this.descrDataVacancy.sErrorText = this.sNoUserValueFind;
      return;
    }


    this.httpService.getNumberResponse(this.id_user, this.descrDataVacancy.id).subscribe((value: Letter[]) => {

      if (value.length > 0) {

        this.sNoUserValueFind = 'Вы уже откликались на данную вакансию. Дождитесь ответа';
        this.descrDataVacancy.sErrorText = this.sNoUserValueFind;
      } else {

        this.cvEditSrv.setCvId(this.descrDataVacancy.id);
        this.router.navigate(['/response']);
      }
    }) ;

  }

  vcDontShow() {
    console.log('vcDontShow', this.descrDataVacancy);
    this.sNoUserValueFind = '';
    this.descrDataVacancy.sErrorText = '';
    if  (!this.bConnected)  {
      this.sNoUserValueFind = 'Для использования функции "Не показывать" пройдите верификацию.';
      this.descrDataVacancy.sErrorText = this.sNoUserValueFind;
      return;
    }
    if (this.bEmployer) {
      this.sNoUserValueFind = 'Работодателям функция "Не показывать" для вакансий недоступна.';
      this.descrDataVacancy.sErrorText = this.sNoUserValueFind;
      return;
    }

    this.httpService.postUnshowVacancy(this.id_user, this.id_user).subscribe( ()=> {
      this.sNoUserValueFind = 'Данная вакансия будет игнорироваться.';
    });

  }

}
