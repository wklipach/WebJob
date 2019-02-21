import { Component, OnInit } from '@angular/core';
import {UserType} from '../../../class/UserType';
import {AuthService} from '../../../services/auth-service.service';
import {Subscription} from 'rxjs';
import {CvEditService} from '../../../services/cv-edit.service';
import {FormBuilder,  FormGroup, Validators} from '@angular/forms';
import {EducationList, EmploymentList, ExperienceList, IndustryList, ScheduleList} from '../../../class/GuideList';

@Component({
  selector: 'app-cv-view',
  templateUrl: './cv-view.component.html',
  styleUrls: ['./cv-view.component.css']
})
export class CvViewComponent implements OnInit {

  protected base64textString = [];
  private subscrDataUserFromId: Subscription;
  protected loadUser: UserType;
  protected _cvitem: any;
  protected _listEducation: string[] = [];
  protected _listExperience: string[] = [];
  protected _listIndustry: string[] = [];
  protected _listSchedule: string[] = [];
  protected _listEmployment: string[] = [];

  cv_id = -1;
  protected formView: FormGroup;

  constructor(private auth: AuthService,
              private cveditserv: CvEditService,
              private fb: FormBuilder,) {

    this.formView = this.fb.group({
      name: ['', Validators.required],
      avatar: ''
    });


  }

  ngOnInit() {

    this.cv_id =  this.cveditserv.getCvId();
    if (this.cv_id > -1) {
      this._cvitem = this.cveditserv.getCvItem();
    }

    if (this._cvitem.Education !== undefined) {
      this._cvitem.Education.forEach(
        (value)=> {
          this._listEducation.push(EducationList[value-1].name);
        })
    }


    if (this._cvitem.Experience !== undefined) {
      this._cvitem.Experience.forEach(
        (value)=> {
          this._listExperience.push(ExperienceList[value-1].name);
        })
    }

    if (this._cvitem.Industry !== undefined) {
      this._cvitem.Industry.forEach(
        (value)=> {
          this._listIndustry.push(IndustryList[value-1].name);
        })
    }

    if (this._cvitem.Schedule !== undefined) {
      this._cvitem.Schedule.forEach(
        (value)=> {
          this._listSchedule.push(ScheduleList[value-1].name);
        })
    }

    if (this._cvitem.Employment !== undefined) {
      this._cvitem.Employment.forEach(
        (value)=> {
          this._listEmployment.push(EmploymentList[value-1].name);
        })
    }

/*
    // employment
    if (this._cvitem.Education !== undefined) {
      this._cvitem.Education.forEach(
        (value)=> {
          this._listEducation.push(EducationList[value-1].name);
        })
    }
*/


    if (this._cvitem !== undefined) {
      this.loadPicture(this._cvitem.id_user);
    }

    console.log('получили _cvitem', this._cvitem);




  }

  onProfileClick($event) {
    //
    console.log('profile');
    //
  }

  ngOnDestroy() {
    if (typeof this.subscrDataUserFromId !== 'undefined') {
      this.subscrDataUserFromId.unsubscribe();
    }
  }


  loadPicture(id_user: number) {
    this.subscrDataUserFromId = this.auth.getDataUserFromId(id_user).subscribe(value => {
      // вытаскиваем из базы картинку аватара
      this.loadUser = value as UserType;
      console.log('this.loadUser',this.loadUser);
      const S = this.loadUser['Avatar'].Avatar;
      if (typeof S !== 'undefined') {
        if (S.length > 0) {
          this.base64textString.push('data:image/png;base64,' + JSON.parse(S).value);
        }
      }
    });
  }


}
