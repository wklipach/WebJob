import { Component, OnInit } from '@angular/core';
import {Guide} from '../../../class/guide';
import {FormControl, FormGroup} from '@angular/forms';
import {GuideService} from '../../../services/guide-service.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-cv_industry',
  templateUrl: './cv_industry.component.html',
  styleUrls: ['./cv_industry.component.css']
})
export class CvIndustryComponent implements OnInit {

  listIndustry: Guide[];
  formIndustry: FormGroup;
  private industrySubscription: Subscription;

  constructor(private is: GuideService) {
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

  }


}
