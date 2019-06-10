import { Component, OnInit } from '@angular/core';
import {GuideService} from '../../../services/guide-service.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Guide} from '../../../class/guide';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-cv-employment',
  templateUrl: './cv-employment.component.html',
  styleUrls: ['./cv-employment.component.css']
})
export class CvEmploymentComponent implements OnInit {

  listEmployment: Guide[];
  formEmployment: FormGroup;
  private employmentSubscription: Subscription;
  private employmentCheckedElementSubscription: Subscription;

  constructor(private is: GuideService, public translate: TranslateService) {

    this.translate.onLangChange.subscribe( value => {
      this.listEmployment = is.getEmploymentList()
    });



    this.formEmployment  = new FormGroup({});
    this.listEmployment = is.getEmploymentList();

    console.log('this.listEmployment',this.listEmployment);

    for (let p in this.listEmployment) {
      this.formEmployment.addControl('employmentCheck'+(this.listEmployment[p].id).toString(), new FormControl(''));
    }

    this.employmentSubscription = this.is.onCheckEmploymentList.subscribe((value: string) =>
      {
        this.is.employmentNumber=this.CheckMassive(this.listEmployment);
      }
    );

    this.employmentCheckedElementSubscription = this.is.onCheckedElementEmploymentList.subscribe((curMass: number[]) =>
      {
        // this.is.industryNumber=this.CheckMassive(this.listIndustry);
        console.log('получили событие onCheckedElemntEmploymentList', curMass);

        if (curMass!==null) {
          if (curMass.length > 0) {
            // гарантированное преобразование в массив с разделителем из запятых
            const arrCurMass = curMass.toString().split(',');
            arrCurMass.forEach((value) => {
              let sEmploymentElement = 'employmentCheck' + value;
              this.formEmployment.controls[sEmploymentElement].setValue('true');
            });
          }
        }
      });


  }

  ngOnInit() {
  }



  // controlPrefics "employmentCheck"
  CheckMassive(bigMassive: Guide[]) : number[] {

    let MyResult: number[] = [];
    let bChecked: boolean = false;

    for (let i = 0; i < bigMassive.length; i++) {
      bChecked = false;
      let ss: string = 'employmentCheck' + (bigMassive[i].id).toString();

      if (!(this.formEmployment.controls[ss].value === '')) {
        bChecked = this.formEmployment.controls[ss].value;
      } else bChecked = false;

      if (bChecked) {
        // заполняем таблицу Employment
        MyResult.push(bigMassive[i].id)
      }
    }

    return MyResult;
  }

  ngOnDestroy() {

    if (typeof this.employmentSubscription !== 'undefined') {
      this.employmentSubscription.unsubscribe();
    }

    if (typeof this.employmentCheckedElementSubscription !== 'undefined') {
      this.employmentCheckedElementSubscription.unsubscribe();
    }




  }

}
