import { Component, OnInit } from '@angular/core';
import {GuideService} from '../../../services/guide-service.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Guide} from '../../../class/guide';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-cv-schedule',
  templateUrl: './cv-schedule.component.html',
  styleUrls: ['./cv-schedule.component.css']
})
export class CvScheduleComponent implements OnInit {

  formSchedule: FormGroup;
  listSchedule: Guide[];
  private scheduleSubscription: Subscription;
  private scheduleCheckedElementSubscription: Subscription;

  constructor(private is: GuideService, public translate: TranslateService) {

    this.translate.onLangChange.subscribe( value => {
      this.listSchedule = is.getScheduleList();
    });

    this.formSchedule  = new FormGroup({});

    this.listSchedule = is.getScheduleList();
    for (let p in this.listSchedule) {
      this.formSchedule.addControl('scheduleCheck'+(this.listSchedule[p].id).toString(), new FormControl(''));
    }

    this.scheduleSubscription = this.is.onCheckScheduleList.subscribe((value: string) =>
      {
        this.is.scheduleNumber=this.CheckMassive(this.listSchedule);
      }
    );

    this.scheduleCheckedElementSubscription = this.is.onCheckedElementScheduleList.subscribe((curMass: number[]) =>
      {
        // this.is.industryNumber=this.CheckMassive(this.listIndustry);
        console.log('получили событие onCheckedElementScheduleList', curMass);
        if (curMass!==null) {
          if (curMass.length > 0) {
            const arrCurMass = curMass.toString().split(',');
            arrCurMass.forEach((value) => {
              let sScheduleElement = 'scheduleCheck' + value;
              this.formSchedule.controls[sScheduleElement].setValue('true');
            });
          }
        }
      });

  }

  ngOnInit() {
  }



  // controlPrefics "scheduleCheck"
  CheckMassive(bigMassive: Guide[]) : number[] {

    let MyResult: number[] = [];
    let bChecked: boolean = false;

    for (let i = 0; i < bigMassive.length; i++) {
      bChecked = false;
      let ss: string = 'scheduleCheck' + (bigMassive[i].id).toString();

      if (!(this.formSchedule.controls[ss].value === '')) {
        bChecked = this.formSchedule.controls[ss].value;
      } else bChecked = false;

      if (bChecked) {
        // заполняем таблицу industry
        MyResult.push(bigMassive[i].id)
      }
    }

    return MyResult;
  }

  ngOnDestroy() {

    if (typeof this.scheduleSubscription !== 'undefined') {
      this.scheduleSubscription.unsubscribe();
    }

    if (typeof this.scheduleCheckedElementSubscription !== 'undefined') {
      this.scheduleCheckedElementSubscription.unsubscribe();
    }

  }

}
