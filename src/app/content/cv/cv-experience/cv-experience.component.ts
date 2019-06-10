import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Guide} from '../../../class/guide';
import {GuideService} from '../../../services/guide-service.service';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-cv-experience',
  templateUrl: './cv-experience.component.html',
  styleUrls: ['./cv-experience.component.css']
})
export class CvExperienceComponent implements OnInit {

  formExperience: FormGroup;
  listExperience: Guide[];
  private experienceSubscription: Subscription;
  private experienceCheckedElementSubscription: Subscription;

  constructor(private is: GuideService, public translate: TranslateService) {

    this.translate.onLangChange.subscribe( value => {
      this.listExperience = is.getExperienceList()
    });

    this.formExperience = new FormGroup({});

    this.listExperience = is.getExperienceList();
    for (let p in this.listExperience) {
      this.formExperience.addControl('experienceCheck'+(this.listExperience[p].id).toString(), new FormControl(''));
    }

    this.experienceSubscription = this.is.onCheckExperienceList.subscribe((value: string) =>
      {
        this.is.experienceNumber=this.CheckMassive(this.listExperience);
      }
    );

    this.experienceCheckedElementSubscription = this.is.onCheckedElementExperienceList.subscribe((curMass: number[]) =>
      {
        // this.is.industryNumber=this.CheckMassive(this.listIndustry);
        console.log('получили событие onCheckedElementExperienceList', curMass);
        if (curMass!==null) {
          if (curMass.length > 0) {
            const arrCurMass = curMass.toString().split(',');
            arrCurMass.forEach((value) => {
              let sExperienceElement = 'experienceCheck' + value;
              this.formExperience.controls[sExperienceElement].setValue('true');
            });
          }
        }
      });


  }

  ngOnInit() {
  }


  // controlPrefics "experienceCheck"
  CheckMassive(bigMassive: Guide[]) : number[] {

    let MyResult: number[] = [];
    let bChecked: boolean = false;

    for (let i = 0; i < bigMassive.length; i++) {
      bChecked = false;
      let ss: string = 'experienceCheck' + (bigMassive[i].id).toString();

      if (!(this.formExperience.controls[ss].value === '')) {
        bChecked = this.formExperience.controls[ss].value;
      } else bChecked = false;

      if (bChecked) {
        // заполняем таблицу industry
        MyResult.push(bigMassive[i].id)
      }
    }

    return MyResult;
  }

  ngOnDestroy() {

    if (typeof this.experienceSubscription !== 'undefined') {
      this.experienceSubscription.unsubscribe();
    }

    if (typeof this.experienceCheckedElementSubscription !== 'undefined') {
      this.experienceCheckedElementSubscription.unsubscribe();
    }

  }

}
