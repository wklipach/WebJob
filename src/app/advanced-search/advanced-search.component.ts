import { Component, OnInit } from '@angular/core';
import {GuideService} from '../services/guide-service.service';
import {Guide} from '../class/guide';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {City} from '../class/City';
import {Vacancy} from '../class/Vacancy';
import {TableVacancyService} from '../services/table-vacancy.service';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth-service.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent implements OnInit {

  public bConnected = false;
  public id_user = -1;
  public bEmployer = false;
  public advancedSearchForm: FormGroup;
  public myDisplayCity: string = '';
  public listTimePlacement: Guide[];
  public listCity : City[] =[];
  public advSearchV = '';
  public advSearchVX = '';
  public advSearchTOP = '';
  public advSearchOlder = '';


  public resFind: {
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
              private authService: AuthService,
              public translate: TranslateService) {
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

    if (!this.authService.getVorCV()) {
      this.translate.get('advanced-search.findOnlyVC').subscribe(
        value => this.advSearchV = value);
      this.translate.get('advanced-search.findShortVc').subscribe(
        value => this.advSearchVX = value);
      this.translate.get('advanced-search.findAdvVc').subscribe(
        value => this.advSearchTOP = value);
      this.translate.get('advanced-search.findVcOlder').subscribe(
        value => this.advSearchOlder = value);
    } else {
      this.translate.get('advanced-search.findOnlyCV').subscribe(
        value => this.advSearchV = value);
      this.translate.get('advanced-search.findShortCv').subscribe(
        value => this.advSearchVX = value);
      this.translate.get('advanced-search.findAdvCv').subscribe(
        value => this.advSearchTOP = value);
      this.translate.get('advanced-search.findCvOlder').subscribe(
        value => this.advSearchOlder = value);
    }


    // устанавливаем город
    this.gs.getCityTable().subscribe(
      (data: City[]) => {
        this.listCity  = this.authService.loadLangCity(data);

        let clearCity : City = {id: -1, name: '---', order: -1, nameEx1: '', nameEx2: ''};
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
    //if (!this.bEmployer) {

    if (!this.authService.getVorCV()) {
    this.httpTvsService.triggerReopenVacancyAdvanced(this.resFind);} else
    this.httpTvsService.triggerReopenCVAdvanced(this.resFind);

    this.router.navigate(['/']);


  }



}
