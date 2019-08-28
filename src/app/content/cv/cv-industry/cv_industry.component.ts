import { Component, OnInit } from '@angular/core';
import {Guide} from '../../../class/guide';
import {FormControl, FormGroup} from '@angular/forms';
import {GuideService} from '../../../services/guide-service.service';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-cv_industry',
  templateUrl: './cv_industry.component.html',
  styleUrls: ['./cv_industry.component.css']
})
export class CvIndustryComponent implements OnInit {

  listIndustry: Guide[];
  formIndustry: FormGroup;
  private industrySubscription: Subscription;
  private industryCheckedElementSubscription: Subscription;

  constructor(private is: GuideService, public translate: TranslateService) {


    this.translate.onLangChange.subscribe( value => {
      this.listIndustry = is.getIndustryList();
      //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!', this.listIndustry);
    });

    this.formIndustry  = new FormGroup({});
    this.listIndustry = is.getIndustryList();
    for (let p in this.listIndustry) {
      this.formIndustry.addControl('industryCheck'+(this.listIndustry[p].id).toString(), new FormControl(''));
    }

    this.industrySubscription = this.is.onCheckIndustryList.subscribe((value: string) =>
                                            {
                                              this.is.industryNumber=this.CheckMassive(this.listIndustry);
                                            }
                                          );


    this.industryCheckedElementSubscription = this.is.onCheckedElementIndustryList.subscribe((curMass: number[]) =>
      {
        if (curMass!==null) {
          //console.log('получили событие onCheckedElementIndustryList', curMass);
          // гарантированное преобразование в массив с разделителем из запятых
          const arrCurMass = curMass.toString().split(',');
          // this.is.industryNumber=this.CheckMassive(this.listIndustry);
          if (arrCurMass.length > 0) {
            arrCurMass.forEach((value) => {
              let sIndustryElement = 'industryCheck' + value;
              this.formIndustry.controls[sIndustryElement].setValue('true');
            });
          }
        }
      });

  }

  ngOnInit() {
  }


  // controlPrefics "industryCheck"
  CheckMassive(bigMassive: Guide[]) : number[] {

    let MyResult: number[] = [];
    let bChecked: boolean = false;

    for (let i = 0; i < bigMassive.length; i++) {
      bChecked = false;
      let ss: string = 'industryCheck' + (bigMassive[i].id).toString();

      if (!(this.formIndustry.controls[ss].value === '')) {
        bChecked = this.formIndustry.controls[ss].value;
      } else bChecked = false;

      if (bChecked) {
        // заполняем таблицу industry
        MyResult.push(bigMassive[i].id)
      }
    }

    return MyResult;
  }

  ngOnDestroy() {

    if (typeof this.industrySubscription !== 'undefined') {
      this.industrySubscription.unsubscribe();
    }

    if (typeof this.industryCheckedElementSubscription !== 'undefined') {
      this.industryCheckedElementSubscription.unsubscribe();
    }


  }


}
