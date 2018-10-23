import { Component, OnInit } from '@angular/core';
import {GuideService} from '../services/guide-service.service';
import {Guide} from '../class/guide';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {City} from '../class/City';
import {Vacancy} from '../class/Vacancy';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent implements OnInit {

  protected advancedSearchForm: FormGroup;
  protected myDisplayCity: string = '';
  protected listTimePlacement: Guide[];
  protected listCity : City[] =[];

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
  }

  constructor(private gs: GuideService) {
    this.listTimePlacement = gs.getTimePlacementList();
    this.resFind = {stringFind: '',
                    timePlacement: '',
                    timePlacementIndex: -1,
                    findOnlyName: false,
                    findOnlyShortDescription: false,
                    Industry: [],
                    Schedule: [],
                    Employment: [],
                    Education: [],
                    Experience: [],
                    City: -1
    };


    this.advancedSearchForm  = new FormGroup({
      'inputSalary' : new FormControl('',
        [Validators.required, Validators.pattern(/[0-9]/)]),
      'inputCity' : new FormControl('',[]),
      'stringFind' : new FormControl('',[])
    });



  }

  ngOnInit() {
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

  timePlacement(sTime: string, sTimeIndex: number) {
    this.resFind.timePlacement = sTime;
    this.resFind.timePlacementIndex = sTimeIndex;
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

    console.log('this.resFind',this.resFind);
  }


}
