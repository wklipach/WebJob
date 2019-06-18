import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Guide} from '../../../class/guide';
import {GuideService} from '../../../services/guide-service.service';
import {Vacancy} from '../../../class/Vacancy';
import {Router} from '@angular/router';
import {NewVacancyService} from '../../../services/new-vacancy.service';
import {City} from '../../../class/City';
import {AuthService} from '../../../services/auth-service.service';
import {DatePipe} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-new-vacancy',
  templateUrl: './new-vacancy.component.html',
  styleUrls: ['./new-vacancy.component.css']
})
export class NewVacancyComponent implements OnInit {

  newVacancyForm: FormGroup;
  listIndustry: Guide[];
  listSchedule: Guide[];
  listEmployment: Guide[];
  listExperience: Guide[];
  listEducation: Guide[];

  displayPeriodList: Guide[];
  listCity: City[] = [];
  myDisplayPeriod = '';
  myDisplayCity = '';
  private id_user = -1;


  constructor(private is: GuideService,
              private httpService: NewVacancyService,
              private router: Router,
              private auth: AuthService,
              public translate: TranslateService) {

    this.displayPeriodList = is.getDisplayPeriodList();
    if (this.displayPeriodList.length > 0) {
      this.myDisplayPeriod = this.displayPeriodList[0].name;
    }

    this.newVacancyForm  = new FormGroup({
    'inputVacancyShortTitle': new FormControl('',
        [Validators.required, Validators.maxLength(90)]),
    'inputVacancyDescription': new FormControl('',
      [Validators.required, Validators.maxLength(3000)]),
    'inputConditions': new FormControl('',
      [Validators.required, Validators.maxLength(3000)]),
     'inputSalaryFrom' : new FormControl('',
       [Validators.required, Validators.pattern(/[0-9]/)], [this.salaryFromAsyncValidator.bind(this)]),
      'inputSalary' : new FormControl('',
        [Validators.required, Validators.pattern(/[0-9]/)], []),
      'displayPeriod' : new FormControl( this.myDisplayPeriod,
        []),
      'inputjobFunction': new FormControl('',
        [Validators.required, Validators.maxLength(3000)]),
      'inputVacancyRequirements': new FormControl('',
        [Validators.required, Validators.maxLength(3000)]),
      'inputCity' : new FormControl('', [])

    });

/*
    this.listExperience = is.getExperienceList();
    for (let p in this.listExperience) {
      this.newVacancyForm.addControl('experienceCheck' + (this.listExperience[p].id).toString(), new FormControl(''));
    }

    this.listEducation = is.getEducationList();
    for (let p in this.listEducation) {
      this.newVacancyForm.addControl('educationCheck' + (this.listEducation[p].id).toString(), new FormControl(''));
    }
*/

    // console.log('this.listIndustry',this.listIndustry);

    is.getCityTable().subscribe(
      (data: City[]) => {

           this.listCity = data;

           if (this.listCity.length > 0) {
             this.myDisplayCity = this.listCity[0].name;
           }
           this.newVacancyForm.setControl('inputCity', new FormControl(this.myDisplayCity, []));
      }
    );

  }



  // валидатор по оплате минимальной
  salaryFromAsyncValidator(control: FormControl): Promise<{[s:string]: boolean}> {
    return new Promise(
      (resolve, reject)=>{
        if (this.newVacancyForm.controls['inputSalary'].value < control.value) {
          this.newVacancyForm.controls['inputSalary'].setValue(control.value);
          resolve(null);
        }
        else {
          resolve(null);
        }
      }
    );
  }


  // валидатор по оплате максимальной
  salaryAsyncValidator(control: FormControl): Promise<{[s:string]: boolean}> {
    return new Promise(
      (resolve, reject)=>{
        if (this.newVacancyForm.controls['inputSalaryFrom'].value > control.value) {
          this.newVacancyForm.controls['inputSalaryFrom'].setValue(control.value);
          resolve(null);
        }
        else {
          resolve(null);
        }
      }
    );
  }




  // controlPrefics "industryCheck"
  CheckMassive(bigMassive: Guide[], controlPrefics: string): number[] {

    const MyResult = [];
    let bChecked = false;

    for (let i = 0; i < bigMassive.length; i++) {
      bChecked = false;
      const ss: string = controlPrefics + (bigMassive[i].id).toString();

      if (!(this.newVacancyForm.controls[ss].value === '')) {
        bChecked = this.newVacancyForm.controls[ss].value;
      } else {
        bChecked = false;
      }

      if (bChecked) {
        // заполняем таблицу industry
        MyResult.push(bigMassive[i].id);
      }
    }

    return MyResult;
  }


  ngOnInit() {

    const Res =  this.auth.loginStorage();
    if (Res.bConnected) {
      this.id_user = Res.id_user;
    } else {
      this.id_user = -1;
    }


  }

  submit() {

    if (this.id_user <= 0) {
      return;
    }

    let MyIndustry: number[];
    const MyVacancy: Vacancy = new Vacancy();
    let MySchedule: number[];
    let MyEmployment: number[];
    let MyEducation: number[];
    let MyExperience: number[];


    const datePipe = new DatePipe('en-US');
    const currentDate = datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm');


    // controlPrefics "industryCheck"
    MyIndustry = this.is.startCheckIndustryList('! startCheckIndustryList !');
    MyEmployment = this.is.startCheckEmploymentList('! startCheckEmploymentList !');
    MySchedule = this.is.startCheckScheduleList('! startCheckScheduleList !');
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


    const period = this.displayPeriodList.find((x) => x.name === this.newVacancyForm.controls['displayPeriod'].value);
    const city = this.listCity.find(x => x.name === this.newVacancyForm.controls['inputCity'].value);

    MyVacancy.VacancyShortTitle = this.newVacancyForm.controls['inputVacancyShortTitle'].value;
    MyVacancy.VacancyDescription = this.newVacancyForm.controls['inputVacancyDescription'].value;
    MyVacancy.Conditions = this.newVacancyForm.controls['inputConditions'].value;
    MyVacancy.SalaryFrom = this.newVacancyForm.controls['inputSalaryFrom'].value;
    MyVacancy.Salary = this.newVacancyForm.controls['inputSalary'].value;

    // должностные обязанности
    MyVacancy.JobFunction = this.newVacancyForm.controls['inputjobFunction'].value;

    // Требования
    MyVacancy.VacancyRequirements = this.newVacancyForm.controls['inputVacancyRequirements'].value;

    MyVacancy.Industry = MyIndustry;
    MyVacancy.DisplayPeriod = period.id;
    MyVacancy.City = city.id;
    // график работы
    MyVacancy.Schedule = MySchedule;
    // занятость
    MyVacancy.Employment = MyEmployment;
    // образование
    MyVacancy.Education = MyEducation;
    // опыт работы
    MyVacancy.Experience = MyExperience;

    // пользователь
    MyVacancy.id_user = this.id_user;

    // дата создания вакансии
    MyVacancy.DateTimeCreate = currentDate;

    return this.httpService.postNewVacancy(MyVacancy).subscribe(
      () => {

        console.log('ПЕРЕХОДИТЬ НА ВАКАНСИИ');
        this.router.navigate(['/vacancies']);
      }
    );

  }


}
