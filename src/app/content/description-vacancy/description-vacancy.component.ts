import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {dataVacancy} from '../../class/Vacancy';
import {MoveService} from '../../services/move.service';
import {GuideService} from '../../services/guide-service.service';
import {ExperienceList} from '../../class/GuideList';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-description-vacancy',
  templateUrl: './description-vacancy.component.html',
  styleUrls: ['./description-vacancy.component.css']
})
export class DescriptionVacancyComponent implements OnInit {


  descrDataVacancy: dataVacancy;

  //отрасль
  sIndusrtry: string[] = [];
  // график работы
  sSchedule: string[] = [];
  // занятость
  sEmployment: string[] = [];
  // образование
  sEducation: string[] = [];
  //опыт работы
  sExperience: string[] = [];

  private dvSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private moveS: MoveService, private sGuide: GuideService) { }

  ngOnInit() {
  this.dvSubscription = this.moveS.getDataVacancy()
      .subscribe(curDataVacancy =>
      {this.descrDataVacancy = curDataVacancy;
      // console.log('this.descrDataVacancy',this.descrDataVacancy);

        // отрасль
        if (typeof this.descrDataVacancy['vacancy'].Industry !== 'undefined') {
        this.descrDataVacancy['vacancy'].Industry.forEach( intIndustry => this.sIndusrtry.push(this.sGuide.getIndustryName(intIndustry) ) );
        }

        // график работы
        if (typeof this.descrDataVacancy['vacancy'].Schedule !== 'undefined') {
        this.descrDataVacancy['vacancy'].Schedule.forEach( intSchedule => this.sSchedule.push(this.sGuide.getScheduleName(intSchedule) ) );
        }

        // занятость
        if (typeof this.descrDataVacancy['vacancy'].Employment !== 'undefined') {
          this.descrDataVacancy['vacancy'].Employment.forEach( intEmployment => this.sEmployment.push(this.sGuide.getEmploymentName(intEmployment) ) );
        }

        // образование
        if (typeof this.descrDataVacancy['vacancy'].Education !== 'undefined') {
          this.descrDataVacancy['vacancy'].Education.forEach( intEducation => this.sEducation.push(this.sGuide.getEducationName(intEducation) ) );
        }

        //опыт работы
        if (typeof this.descrDataVacancy['vacancy'].Experience !== 'undefined') {
          this.descrDataVacancy['vacancy'].Experience.forEach( intExperience => this.sExperience.push(this.sGuide.getExperienceName(intExperience) ) );
        }



      });
  }

  ngOnDestroy() {
    this.dvSubscription.unsubscribe();
  }


}
