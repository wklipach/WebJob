import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {City} from '../../../class/City';
import {GuideService} from '../../../services/guide-service.service';
import {Guide} from '../../../class/guide';
import {AuthService} from '../../../services/auth-service.service';
import {VacanciesListService} from '../../../services/vacancies-list.service';
import {Subscription} from 'rxjs';
import {DatePipe} from '@angular/common';
import {Vacancy} from '../../../class/Vacancy';
import {NewVacancyService} from '../../../services/new-vacancy.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-vacancy-edit',
  templateUrl: './vacancy-edit.component.html',
  styleUrls: ['./vacancy-edit.component.css']
})
export class VacancyEditComponent implements OnInit {

  public editVacancyForm: FormGroup;
  listCity : City[] =[];
  myDisplayCity: string = '';
  myDisplayPeriod: string = '';
  displayPeriodList: Guide[];
  private id_user: number = -1;

  vac_id: number = 0;
  private _vacitem: any;

  private cvDeleteVac: Subscription;


  constructor(private is: GuideService,
              private auth: AuthService,
              private httpService: NewVacancyService,
              private router: Router,
              private vls: VacanciesListService,
              public translate: TranslateService) {

    this.displayPeriodList = is.getDisplayPeriodList();

    // if (this.displayPeriodList.length>0) this.myDisplayPeriod = this.displayPeriodList[0].name;

    this.editVacancyForm  = new FormGroup({
      'inputVacancyShortTitle': new FormControl('',
        [Validators.required, Validators.maxLength(90)]),
      'inputVacancyDescription': new FormControl('',
        [Validators.required, Validators.maxLength(3000)]),
      'inputConditions': new FormControl('',
        [Validators.required, Validators.maxLength(3000)]),
      'inputSalaryFrom' : new FormControl('',
        [Validators.required, Validators.pattern(/[0-9]/)], [this.salaryFromAsyncValidator.bind(this)]),
      'inputSalary' : new FormControl('',
        [Validators.required, Validators.pattern(/[0-9]/)]),
      'displayPeriod' : new FormControl( this.myDisplayPeriod,
        []),
      'inputjobFunction': new FormControl('',
        [Validators.required, Validators.maxLength(3000)]),
      'inputVacancyRequirements': new FormControl('',
        [Validators.required, Validators.maxLength(3000)]),
      'inputCity' : new FormControl('',[])
    });

  }


  // валидатор по оплате минимальной
  salaryFromAsyncValidator(control: FormControl): Promise<{[s:string]: boolean}> {
    return new Promise(
      (resolve, reject)=>{
        if (this.editVacancyForm.controls['inputSalary'].value < control.value) {
          this.editVacancyForm.controls['inputSalary'].setValue(control.value);
          resolve(null);
        }
        else {
          resolve(null);
        }
      }
    );
  }


  ngOnInit() {
    var Res =  this.auth.loginStorage();
    if (Res.bConnected) this.id_user = Res.id_user; else this.id_user = -1;
    this.vac_id =  this.vls.getVacId();


    // TODO getVacItem
    if (this.vac_id>-1) this._vacitem = this.vls.getVacItem();

    //console.log('this._vacitem',this._vacitem);

    this.loadCurrentVacancy(this._vacitem);

  }

  ngOnDestroy() {

    if (typeof  this.cvDeleteVac !== 'undefined') {
      this.cvDeleteVac.unsubscribe();
    }

  }



loadCurrentVacancy(item: any) {

    // редактируемая зарплата
    if (typeof item.SalaryFrom !== 'undefined') {
      this.editVacancyForm.controls['inputSalaryFrom'].setValue(item.SalaryFrom);
    }

    if (typeof item.Salary !== 'undefined') {
      this.editVacancyForm.controls['inputSalary'].setValue(item.Salary);
    }

    //редактируемая должность (она же позиция)
    if (typeof item.VacancyShortTitle !== 'undefined') {
      this.editVacancyForm.controls['inputVacancyShortTitle'].setValue(item.VacancyShortTitle);
    }

    //описание вакансии
    if (typeof item.VacancyDescription !== 'undefined') {
      this.editVacancyForm.controls['inputVacancyDescription'].setValue(item.VacancyDescription);
    }

    //полное описание вакансии
    if (typeof item.Conditions !== 'undefined') {
      this.editVacancyForm.controls['inputConditions'].setValue(item.Conditions);
    }

    // должностные обязанности
    if (typeof item.JobFunction !== 'undefined') {
      this.editVacancyForm.controls['inputjobFunction'].setValue(item.JobFunction);
    }

   // Требования
   if (typeof item.VacancyRequirements !== 'undefined') {
     this.editVacancyForm.controls['inputVacancyRequirements'].setValue(item.VacancyRequirements);
   }

    // устанавливаем город
    this.is.getCityTable().subscribe(
      (data: City[]) => {
        this.listCity = this.auth.loadLangCity(data);

        if (typeof item.City !== 'undefined') {
          if (this.listCity.length > 0) this.myDisplayCity = this.listCity[item.City - 1].name;
          //console.log('this.myDisplayCity',this.myDisplayCity);
        } else {
          if (this.listCity.length > 0) this.myDisplayCity = this.listCity[0].name;
        }
        this.editVacancyForm.setControl('inputCity', new FormControl(this.myDisplayCity, []));
      }
    );

    //устанавливаем срок показа

  //console.log('item.DisplayPeriod', item.DisplayPeriod);

    if (typeof item.DisplayPeriod !== 'undefined' && item.DisplayPeriod !==  null) {
      //console.log('DisplayPeriod',this.displayPeriodList);
      this.myDisplayPeriod = this.displayPeriodList[item.DisplayPeriod-1].name;
      this.editVacancyForm.setControl('displayPeriod', new FormControl(this.myDisplayPeriod, []));
    }


    //ставим чек-боксы в элементах ОТРАСЛЬ

  if (typeof item.Industry !== 'undefined' && item.Industry !==  null) {
      const arrIndustry = item.Industry.split(',');
      this.is.startCheckedElementIndustryList(arrIndustry);}
    //ставим чек-боксы в элементах  ЗАНЯТОСТЬ
  if (typeof item.Employment !== 'undefined' && item.Employment !==  null) {
    const arrEmployment = item.Employment.split(',');
    this.is.startCheckedElementEmploymentList(arrEmployment);}
    //ставим чек-боксы в элементах  график работы
  if (typeof item.Schedule !== 'undefined' && item.Schedule !==  null) {
    const arrSchedule = item.Schedule.split(',');
    this.is.startCheckedElementScheduleList(arrSchedule);}
    //ставим чек-боксы в элементах  Опыт работы
  if (typeof item.Experience !== 'undefined' && item.Experience !==  null) {
    const arrExperience = item.Experience.split(',');
    this.is.startCheckedElementExperienceList(arrExperience);}
    //ставим чек-боксы в элементах  Образование
  if (typeof item.Education !== 'undefined' && item.Education !==  null) {
    const arrEducation = item.Education.split(',');
    this.is.startCheckedElementEducationList(arrEducation);}
  }


  submit() {
    this.UpdateVac(this._vacitem);
  }

  UpdateVac(item: any) {

    if (this.id_user <= 0) return;

    this.newcv(item.id);


  }


  newcv(id: number) {

    if (this.id_user <= 0) return;

    let MyIndustry: number[];
    let MyVacancy: Vacancy = new Vacancy();
    let MySchedule: number[];
    let MyEmployment: number[];
    let MyEducation: number[];
    let MyExperience: number[];


    var datePipe = new DatePipe("en-US");
    var currentDate = datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm');


    // controlPrefics "industryCheck"
    MyIndustry = this.is.startCheckIndustryList('! startCheckIndustryList !');
    MyEmployment= this.is.startCheckEmploymentList('! startCheckEmploymentList !');
    MySchedule= this.is.startCheckScheduleList('! startCheckScheduleList !');
    MyEducation = this.is.startCheckEducationList('! startCheckEducationList !');
    MyExperience = this.is.startCheckExperienceList('! startCheckExperienceList !');


    //console.log('MyIndustry===');
    //console.log(MyIndustry);

    //console.log('MyEmployment===');
    //console.log(MyEmployment);

    //console.log('MySchedule===');
    //console.log(MySchedule);

    //console.log('MyEducation===');
    //console.log(MyEducation);

    //console.log('MyExperience===');
    //console.log(MyExperience);



    let sPeriod = '';
    if (this.editVacancyForm.controls['displayPeriod'].value !== '')
      sPeriod = this.editVacancyForm.controls['displayPeriod'].value;

    let period : Guide;
    if (sPeriod !== '')
     period = this.displayPeriodList.find(x=>x.name===sPeriod); else
     period = this.displayPeriodList[0];

    let city = this.listCity.find(x=>x.name===this.editVacancyForm.controls['inputCity'].value);

    MyVacancy.VacancyShortTitle = this.editVacancyForm.controls['inputVacancyShortTitle'].value;
    MyVacancy.VacancyDescription = this.editVacancyForm.controls['inputVacancyDescription'].value;
    MyVacancy.Conditions = this.editVacancyForm.controls['inputConditions'].value;
    MyVacancy.SalaryFrom = this.editVacancyForm.controls['inputSalaryFrom'].value;
    MyVacancy.Salary = this.editVacancyForm.controls['inputSalary'].value;
    // должностные обязанности
    MyVacancy.JobFunction = this.editVacancyForm.controls['inputjobFunction'].value;
    // Требования
    MyVacancy.VacancyRequirements = this.editVacancyForm.controls['inputVacancyRequirements'].value;



    //console.log('sssssss111111111');


    MyVacancy.Industry = MyIndustry;

    //console.log('sssssss22222222222222');

    MyVacancy.DisplayPeriod = period.id;

    //console.log('sssssss33333333333');
    MyVacancy.City = city.id;
    //console.log('sssssss444444444444444444');
    // график работы
    MyVacancy.Schedule = MySchedule;
    //console.log('sssssss5555555555555555555');
    // занятость
    MyVacancy.Employment = MyEmployment;
    //console.log('sssssss6666666666666666666');
    // образование
    MyVacancy.Education = MyEducation;
    //опыт работы
    MyVacancy.Experience = MyExperience;

    //пользователь
    MyVacancy.id_user = this.id_user;

    //дата создания вакансии оставляем старую
    // MyVacancy.DateTimeCreate = currentDate;
    MyVacancy.DateTimeCreate = this._vacitem.DateTimeCreate;


    MyVacancy.id = id;

    return this.httpService.postVacancy(MyVacancy).subscribe(
      () => {
        this.router.navigate(['/vacancies']);
      }
    );


  }


}
