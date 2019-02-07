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
              private vls: VacanciesListService) {

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
    if (this.vac_id>-1) this._vacitem = this.vls.getVacItem();

    console.log('this._vacitem',this._vacitem);

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
        this.listCity = data;

        if (typeof item.City !== 'undefined') {
          if (this.listCity.length > 0) this.myDisplayCity = this.listCity[item.City - 1].name;
          console.log('this.myDisplayCity',this.myDisplayCity);
        } else {
          if (this.listCity.length > 0) this.myDisplayCity = this.listCity[0].name;
        }
        this.editVacancyForm.setControl('inputCity', new FormControl(this.myDisplayCity, []));
      }
    );

    //устанавливаем срок показа
    if (typeof item.DisplayPeriod !== 'undefined') {
      console.log('DisplayPeriod',this.displayPeriodList);
      this.myDisplayPeriod = this.displayPeriodList[item.DisplayPeriod-1].name;
      this.editVacancyForm.setControl('displayPeriod', new FormControl(this.myDisplayPeriod, []));
    }


    //ставим чек-боксы в элементах ОТРАСЛЬ
    this.is.startCheckedElementIndustryList(item.Industry);
    //ставим чек-боксы в элементах  ЗАНЯТОСТЬ
    this.is.startCheckedElementEmploymentList(item.Employment);
    //ставим чек-боксы в элементах  график работы
    this.is.startCheckedElementScheduleList(item.Schedule);
    //ставим чек-боксы в элементах  Опыт работы
    this.is.startCheckedElementExperienceList(item.Experience);
    //ставим чек-боксы в элементах  Образование
    this.is.startCheckedElementEducationList(item.Education);
  }


  submit() {
    console.log('submit');
    this.UpdateVac(this._vacitem);
  }

  UpdateVac(item: any) {
    console.log('Смотрим строку ниже');
    console.log(item);
    item.bInvisible = true;
    this.cvDeleteVac = this.vls.setDeleteVac(this.vac_id, item).subscribe( ()=> {
        console.log('удалили элемент', this.vac_id);
        this.newcv();
      },
      err => console.log('при удалении элемента возникла нештатная ситуация ',err));
  }


  newcv() {

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


    console.log('MyIndustry===');
    console.log(MyIndustry);

    console.log('MyEmployment===');
    console.log(MyEmployment);

    console.log('MySchedule===');
    console.log(MySchedule);

    console.log('MyEducation===');
    console.log(MyEducation);

    console.log('MyExperience===');
    console.log(MyExperience);


    let period = this.displayPeriodList.find(x=>x.name===this.editVacancyForm.controls['displayPeriod'].value);
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




    MyVacancy.Industry = MyIndustry;
    MyVacancy.DisplayPeriod = period.id;
    MyVacancy.City = city.id;
    // график работы
    MyVacancy.Schedule = MySchedule;
    // занятость
    MyVacancy.Employment = MyEmployment;
    // образование
    MyVacancy.Education = MyEducation;
    //опыт работы
    MyVacancy.Experience = MyExperience;

    //пользователь
    MyVacancy.id_user = this.id_user;

    //дата создания вакансии оставляем старую
    // MyVacancy.DateTimeCreate = currentDate;
    MyVacancy.DateTimeCreate = this._vacitem.DateTimeCreate;


    return this.httpService.postNewVacancy(MyVacancy).subscribe(
      () => {
        this.router.navigate(['/vacancies']);
      }
    );


  }


}
