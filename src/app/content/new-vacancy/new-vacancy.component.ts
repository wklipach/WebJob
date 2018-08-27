import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Guide} from '../../class/guide';
import {GuideService} from '../../services/guide-service.service';
import {Vacancy} from '../../class/Vacancy';
import {Router} from '@angular/router';
import {NewVacancyService} from '../../services/new-vacancy.service';
import {City} from '../../class/City';

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
  listCity : City[] =[];
  myDisplayPeriod: string = "";
  myDisplayCity: string = "";


  constructor(private is: GuideService, private httpService: NewVacancyService, private router: Router) {

    this.displayPeriodList = is.getDisplayPeriodList();
    if (this.displayPeriodList.length>0) this.myDisplayPeriod = this.displayPeriodList[0].name;

    this.newVacancyForm  = new FormGroup({
    'inputVacancyShortTitle': new FormControl('',
        [Validators.required, Validators.maxLength(30)]),
    'inputVacancyDescription': new FormControl('',
      [Validators.required, Validators.maxLength(400)]),
    'inputVacancyBigDescription': new FormControl('',
      [Validators.required, Validators.maxLength(2000)]),
     'inputSalaryFrom' : new FormControl('',
       [Validators.required, Validators.pattern(/[0-9]/)]),
      'inputSalary' : new FormControl('',
        [Validators.required, Validators.pattern(/[0-9]/)]),
      'displayPeriod' : new FormControl( this.myDisplayPeriod,
        []),
      'inputCity' : new FormControl('',[])
    });

    this.listIndustry = is.getIndustryList();
    for (let p in this.listIndustry) {
      this.newVacancyForm.addControl('industryCheck'+(this.listIndustry[p].id).toString(), new FormControl(''));
    }

    this.listSchedule = is.getScheduleList();
    for (let p in this.listSchedule) {
      this.newVacancyForm.addControl('scheduleCheck'+(this.listSchedule[p].id).toString(), new FormControl(''));
    }

    this.listEmployment = is.getEmploymentList();
    for (let p in this.listEmployment) {
      this.newVacancyForm.addControl('employmentCheck' + (this.listEmployment[p].id).toString(), new FormControl(''));
    }

    this.listExperience = is.getExperienceList();
    for (let p in this.listExperience) {
      this.newVacancyForm.addControl('experienceCheck' + (this.listExperience[p].id).toString(), new FormControl(''));
    }

    this.listEducation = is.getEducationList();
    for (let p in this.listEducation) {
      this.newVacancyForm.addControl('educationCheck' + (this.listEducation[p].id).toString(), new FormControl(''));
    }






    // console.log('this.listIndustry',this.listIndustry);

    is.getCityTable().subscribe(
      (data: City[]) => {
           this.listCity = data;
           if (this.listCity.length > 0) this.myDisplayCity = this.listCity[0].name;
           this.newVacancyForm.setControl('inputCity', new FormControl(this.myDisplayCity, []));
      }
    );

  }


  // controlPrefics "industryCheck"
  CheckMassive(bigMassive: Guide[], controlPrefics: string) : number[] {

    let MyResult: number[] = [];
    let bChecked: boolean = false;

    for (let i = 0; i < bigMassive.length; i++) {
      bChecked = false;
      let ss: string = controlPrefics + (bigMassive[i].id).toString();

      if (!(this.newVacancyForm.controls[ss].value === '')) {
        bChecked = this.newVacancyForm.controls[ss].value;
      } else bChecked = false;

      if (bChecked) {
        // заполняем таблицу industry
        MyResult.push(bigMassive[i].id)
      }
    }

    return MyResult;
  }


  ngOnInit() {  }


  submit() {
    let MyIndustry: number[];
    let MyVacancy: Vacancy = new Vacancy();
    let MySchedule: number[];
    let MyEmployment: number[];
    let MyEducation: number[];
    let MyExperience: number[];


    // controlPrefics "industryCheck"
    MyIndustry = this.CheckMassive(this.listIndustry, "industryCheck");
    MySchedule = this.CheckMassive(this.listSchedule, "scheduleCheck");
    MyEmployment = this.CheckMassive(this.listEmployment, "employmentCheck");
    MyEducation = this.CheckMassive(this.listEducation, "educationCheck");
    MyExperience = this.CheckMassive(this.listExperience, "experienceCheck");


/*
     for ( let i=0; i<this.listIndustry.length; i++ ) {
       bChecked = false;
       let ss: string = "industryCheck"+(this.listIndustry[i].id).toString();

       if (!(this.newVacancyForm.controls[ss].value ==='')) {
         bChecked=this.newVacancyForm.controls[ss].value;
       } else bChecked = false;

         if (bChecked) {
           // заполняем таблицу industry
           MyIndustry.push(this.listIndustry[i].id)
         }
    }
*/

    let period = this.displayPeriodList.find(x=>x.name===this.newVacancyForm.controls['displayPeriod'].value);
    let city = this.listCity.find(x=>x.name===this.newVacancyForm.controls['inputCity'].value);

    MyVacancy.VacancyShortTitle = this.newVacancyForm.controls['inputVacancyShortTitle'].value;
    MyVacancy.VacancyDescription = this.newVacancyForm.controls['inputVacancyDescription'].value;
    MyVacancy.VacancyBigDescription = this.newVacancyForm.controls['inputVacancyBigDescription'].value;
    MyVacancy.SalaryFrom = this.newVacancyForm.controls['inputSalaryFrom'].value;
    MyVacancy.Salary = this.newVacancyForm.controls['inputSalary'].value;
    //
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


    return this.httpService.postNewVacancy(MyVacancy).subscribe(
      () => {
        console.log(MyVacancy);
      }
    );

  }


}
