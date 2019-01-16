import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {dataVacancy} from '../../../class/Vacancy';
import {MoveService} from '../../../services/move.service';
import {GuideService} from '../../../services/guide-service.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-vacancy-description',
  templateUrl: './vacancy-description.component.html',
  styleUrls: ['./vacancy-description.component.css']
})
export class VacancyDescriptionComponent implements OnInit {

  descrDataVacancy: dataVacancy;

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

  private dvSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private moveS: MoveService, private sGuide: GuideService, private router: Router) { }


  ngOnInit() {





      this.dvSubscription = this.moveS.getDataVacancy()
      .subscribe (curDataVacancy =>
      {
        this.descrDataVacancy = curDataVacancy;

        if (typeof this.descrDataVacancy !== 'undefined') {
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

        // опыт работы
        if (typeof this.descrDataVacancy['vacancy'].Experience !== 'undefined') {
          this.descrDataVacancy['vacancy'].Experience.forEach( intExperience => this.sExperience.push(this.sGuide.getExperienceName(intExperience) ) );
        }


          console.log('JobFunction', this.descrDataVacancy['vacancy'].JobFunction);
          console.log('!!!', '');

          console.log('VacancyRequirements', this.descrDataVacancy['vacancy'].VacancyRequirements);
          console.log('!!!', '');

          console.log('Conditions', this.descrDataVacancy['vacancy'].Conditions);

          console.log('Conditions закончено!!!', '');



        }

      }, error => {this.router.navigate(['/home']); } );


    if (typeof this.descrDataVacancy === 'undefined') {
      this.router.navigate(['/home']);
    }
  }

  ngOnDestroy() {
    this.dvSubscription.unsubscribe();
  }


}
