import { Component, OnInit } from '@angular/core';
import {GuideService} from '../services/guide-service.service';
import {Guide} from '../class/guide';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {City} from '../class/City';
import {Vacancy} from '../class/Vacancy';
import {TableVacancyService} from '../services/table-vacancy.service';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth-service.service';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent implements OnInit {

  private bConnected = false;
  private id_user = -1;
  protected bEmployer = false;
  protected advancedSearchForm: FormGroup;
  protected myDisplayCity: string = '';
  protected listTimePlacement: Guide[];
  protected listCity : City[] =[];
  protected advSearchV = '';
  protected advSearchVX = '';
  protected advSearchTOP = '';
  protected advSearchOlder = '';


  protected resFind: {
    stringFind: string;
    timePlacement : string;
    timePlacementIndex : number;
    findOnlyName: boolean;
    findOnlyShortDescription: boolean;
    Industry: number[];
    Schedule: number[];
    Employment: number[];
    Education: number[];
    Experience: number[];
    City: number;
    Salary: string;
    timePlacementComment: string;
  }

  constructor(private gs: GuideService,
              private router: Router,
              private httpTvsService: TableVacancyService,
              private authService: AuthService) {
    this.listTimePlacement = gs.getTimePlacementList();
    this.resFind = {stringFind: '',
                    timePlacement: '',
                    timePlacementIndex: -1,
                    timePlacementComment: '',
                    findOnlyName: false,
                    findOnlyShortDescription: false,
                    Industry: [],
                    Schedule: [],
                    Employment: [],
                    Education: [],
                    Experience: [],
                    City: -1,
                    Salary: ''
    };


    this.advancedSearchForm  = new FormGroup({
      'inputSalary' : new FormControl('',
        [Validators.required, Validators.pattern(/[0-9]/)]),
      'inputCity' : new FormControl('',[]),
      'stringFind' : new FormControl('',[]),
      'timePlacement' : new FormControl('',[])
    });



  }

  ngOnInit() {

    var Res =  this.authService.loginStorage();
    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;
    this.bEmployer = Res.bEmployer;

    if (!this.bEmployer) {
      this.advSearchV =  'Искать только в названии вакансии';
      this.advSearchVX =  'Искать только в кратком описании вакансии';
      this.advSearchTOP = 'Расширенный поиск вакансий';
      this.advSearchOlder ='Искать вакансии не старше';
    } else {
      this.advSearchV = 'Искать только в названии резюме';
      this.advSearchVX =  'Искать только в кратком описании резюме';
      this.advSearchTOP =  'Расширенный поиск резюме';
      this.advSearchOlder =  'Искать резюме не старше';
    }


    // устанавливаем город
    this.gs.getCityTable().subscribe(
      (data: City[]) => {
        this.listCity  = data;

        let clearCity : City = {id: -1, name: 'Не учитывать', order: -1};
        this.listCity.push(clearCity);
          if (this.listCity.length > 0) this.myDisplayCity = this.listCity[this.listCity.length-1].name;
        this.advancedSearchForm.setControl('inputCity', new FormControl(this.myDisplayCity, []));


      }

    );

  }

  timePlacement(sTime: string, sTimeIndex: number, sTimeComment: string) {
    this.resFind.timePlacement = sTime;
    this.resFind.timePlacementIndex = sTimeIndex;
    this.resFind.timePlacementComment = sTimeComment;
  }

  findOnly(bName: boolean, bShortDescription: boolean) {
    this.resFind.findOnlyName = bName;
    this.resFind.findOnlyShortDescription = bShortDescription;
  }



  submit() {
    let MyIndustry: number[];
    let MySchedule: number[];
    let MyEmployment: number[];
    let MyEducation: number[];
    let MyExperience: number[];
    MyIndustry = this.gs.startCheckIndustryList('! startCheckIndustryList !');
    MyEmployment= this.gs.startCheckEmploymentList('! startCheckEmploymentList !');
    MySchedule= this.gs.startCheckScheduleList('! startCheckScheduleList !');
    MyEducation = this.gs.startCheckEducationList('! startCheckEducationList !');
    MyExperience = this.gs.startCheckExperienceList('! startCheckExperienceList !');
    let city = this.listCity.find(x=>x.name===this.advancedSearchForm.controls['inputCity'].value);

    this.resFind.Industry = MyIndustry;
    this.resFind.Employment = MyEmployment;
    this.resFind.Schedule = MySchedule;
    this.resFind.Education = MyEducation;
    this.resFind.Experience = MyExperience;
    this.resFind.City = city.id;
    this.resFind.stringFind = this.advancedSearchForm.controls['stringFind'].value;
    this.resFind.Salary = this.advancedSearchForm.controls['inputSalary'].value;



    //отправляем событие, словит его app-component
    if (!this.bEmployer) {
    this.httpTvsService.triggerReopenVacancyAdvanced(this.resFind);} else
    this.httpTvsService.triggerReopenCVAdvanced(this.resFind);

    this.router.navigate(['/']);


  }



}
