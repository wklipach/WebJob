import { Component, OnInit } from '@angular/core';
import {GuideService} from '../../../services/guide-service.service';
import {Guide} from '../../../class/guide';
import {FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-cv-education',
  templateUrl: './cv-education.component.html',
  styleUrls: ['./cv-education.component.css']
})
export class CvEducationComponent implements OnInit {

  formEducation: FormGroup;
  listEducation: Guide[];
  private educationSubscription: Subscription;
  private educationCheckedElementSubscription: Subscription;

  constructor(private is: GuideService) {

    this.formEducation = new FormGroup({});

    this.listEducation = is.getEducationList();
    for (let p in this.listEducation) {
      this.formEducation.addControl('educationCheck'+(this.listEducation[p].id).toString(), new FormControl(''));
    }

    this.educationSubscription =  this.is.onCheckEducationList.subscribe((value: string) =>
      {
        this.is.educationNumber=this.CheckMassive(this.listEducation);
      }
    );

    this.educationCheckedElementSubscription = this.is.onCheckedElementEducationList.subscribe((curMass: number[]) =>
      {
        // this.is.industryNumber=this.CheckMassive(this.listIndustry);
        console.log('получили событие onCheckedElementEducationList', curMass);


        if (curMass.length>0) {
          curMass.forEach( (value)=>{
            let sEducationElement = 'educationCheck'+value;
            this.formEducation.controls[sEducationElement].setValue('true');
          });
        }
      }
    );

  }

  ngOnInit() {
  }

  // controlPrefics "educationCheck"
  CheckMassive(bigMassive: Guide[]) : number[] {

    let MyResult: number[] = [];
    let bChecked: boolean = false;

    for (let i = 0; i < bigMassive.length; i++) {
      bChecked = false;
      let ss: string = 'educationCheck' + (bigMassive[i].id).toString();

      if (!(this.formEducation.controls[ss].value === '')) {
        bChecked = this.formEducation.controls[ss].value;
      } else bChecked = false;

      if (bChecked) {
        // заполняем таблицу industry
        MyResult.push(bigMassive[i].id)
      }
    }

    return MyResult;
  }


  ngOnDestroy() {

    if (typeof this.educationSubscription !== 'undefined') {
      this.educationSubscription.unsubscribe();
    }

    if (typeof this.educationCheckedElementSubscription !== 'undefined') {
      this.educationCheckedElementSubscription.unsubscribe();
    }

  }


}
