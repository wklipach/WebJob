import { Component, OnInit } from '@angular/core';
import {UserType} from '../../../class/UserType';
import {AuthService} from '../../../services/auth-service.service';
import {Subscription} from 'rxjs';
import {CvEditService} from '../../../services/cv-edit.service';
import {FormBuilder,  FormGroup, Validators} from '@angular/forms';
import {
  staticGuideList
} from '../../../class/GuideList';
import {AdvancedLanguage, Language} from '../../../class/Language';
import {TranslateService} from '@ngx-translate/core';

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
  protected _listLanguage: any = [];
  protected _listPrevious: any = [];

  cv_id = -1;
  protected formView: FormGroup;

  constructor(private auth: AuthService,
              private cveditserv: CvEditService,
              private fb: FormBuilder,
              public translate: TranslateService) {

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


/*
Education: "5,1"
​Employment: "5,1"
Experience: "1,4"
Industry: "1,30"
Schedule: "1,5"
const arrEmployment = item.Employment.split(',');
*/


    console.log('this._cvitem', this._cvitem);

    if (this._cvitem !== null) {
      if (this._cvitem.Education !== undefined) {
        if (this._cvitem.Education !== null) {
          const arrEducation = this._cvitem.Education.split(',');
          arrEducation.forEach(
            (value) => {
              this._listEducation.push(staticGuideList.EducationList[value - 1].name);
            })
        }
      }
    }


    if (this._cvitem !== null) {
      if (this._cvitem.Experience !== undefined) {
        if (this._cvitem.Experience !== null) {
          const arrExperience = this._cvitem.Experience.split(',');
          arrExperience.forEach(
            (value) => {
              this._listExperience.push(staticGuideList.ExperienceList[value - 1].name);
            })
        }
      }
    }



    if (this._cvitem !== null) {
      if (this._cvitem.Industry !== undefined) {
        if (this._cvitem.Industry !== null) {
          const arrIndustry = this._cvitem.Industry.split(',');
          arrIndustry.forEach(
            (value) => {
              this._listIndustry.push(staticGuideList.IndustryList[value - 1].name);
            })
        }
      }
    }

    if (this._cvitem !== null) {
      if (this._cvitem.Schedule !== undefined) {
        if (this._cvitem.Schedule !== null) {
          const arrSchedule = this._cvitem.Schedule.split(',');
          arrSchedule.forEach(
            (value) => {
              this._listSchedule.push(staticGuideList.ScheduleList[value - 1].name);
            })
        }
      }
    }

    if (this._cvitem !== null) {
      if (this._cvitem.Employment !== undefined) {
        if (this._cvitem.Employment !== null) {
          const arrEmployment = this._cvitem.Employment.split(',');
          arrEmployment.forEach(
            (value) => {
              this._listEmployment.push(staticGuideList.EmploymentList[value - 1].name);
            })
        }
      }
    }

    if (this._cvitem !== undefined) {
      if (this._cvitem !== null) this.loadPicture(this._cvitem.id_user);
    }


    //языки
    if (this._cvitem !== undefined) {
      if (this._cvitem !== null) this.loadLanguage(this._cvitem.id);
    }

     //предыдущие места работы
    if (this._cvitem !== undefined) {
      if (this._cvitem !== null) this.loadPrevious(this._cvitem.id);
    }
    console.log('получили _cvitem', this._cvitem);


  }


  loadPrevious(id_cv: number) {
    this.cveditserv.getCvPrevious(id_cv).subscribe(curValue => {

      let cvP: any  = curValue;
      cvP.forEach((cvP, ih) => {
        this._listPrevious.push({dStartDate: cvP.dStartDate,
              dCompletionDate: cvP.dCompletionDate,
              sCompany: cvP.sCompany,
              sPreviousPosition: cvP.sPreviousPosition,
              sInputPositionDescription: cvP.sInputPositionDescription});
              });

    });
  }

  loadLanguage(id_cv: number) {
    this.cveditserv.getCvLanguage(id_cv).subscribe(curValue => {

        let cvL: any  = curValue;
        cvL.forEach((cvL, ih) => {
          this._listLanguage.push({id_cv: cvL.id_cv, id_language: cvL.id_language-1, id_level: cvL.id_level-1, language_name: staticGuideList.LanguageList[cvL.id_language-1].name, language_level: staticGuideList.LevelLanguageList[cvL.id_level-1].name});
      });

      });
  }


  onProfileClick($event) {
    console.log('profile');
  }

  ngOnDestroy() {
    if (typeof this.subscrDataUserFromId !== 'undefined') {
      this.subscrDataUserFromId.unsubscribe();
    }
  }


  loadPicture(id_user: number) {
    this.subscrDataUserFromId = this.auth.getDataUserFromId(id_user).subscribe(value => {
      // вытаскиваем из базы картинку аватара
      this.loadUser = value[0] as UserType;
      console.log('this.loadUser',this.loadUser);
      const S = this.loadUser.Avatar;
      if (typeof S !== 'undefined') {
        if (S !== null) {
          if (S.length > 0) {
            this.base64textString.push('data:image/png;base64,' + JSON.parse(S).value);
          }
        }
      }
    });
  }


}
