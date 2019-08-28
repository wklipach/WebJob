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
import {Router} from '@angular/router';
import {MoveService} from '../../../services/move.service';
import {TableVacancyService} from '../../../services/table-vacancy.service';
import {GlobalRef} from '../../../services/globalref';

@Component({
  selector: 'app-cv-view',
  templateUrl: './cv-view.component.html',
  styleUrls: ['./cv-view.component.css']
})
export class CvViewComponent implements OnInit {

  public sAvatarPath : string = '';
  public base64textString = [];
  private subscrDataUserFromId: Subscription;
  public loadUser: UserType;
  public _cvitem: any;
  private id_user = -1;
  public _listEducation: string[] = [];
  public _listExperience: string[] = [];
  public _listIndustry: string[] = [];
  public _listSchedule: string[] = [];
  public _listEmployment: string[] = [];
  public _listLanguage: any = [];
  public _listPrevious: any = [];
  private dvSubscVacancy: Subscription;
  public errorResponse = '';

  public bConnected = false;
  public bEmployer = false;


  cv_id = -1;
  public formView: FormGroup;

  constructor(private auth: AuthService,
              private cveditserv: CvEditService,
              private httpService: TableVacancyService,
              private fb: FormBuilder,
              private router: Router,
              private moveS: MoveService,
              public translate: TranslateService,
              public gr: GlobalRef) {

    this.formView = this.fb.group({
      name: ['', Validators.required],
      avatar: ''
    });


  }

  ngOnInit() {

    this.errorResponse = '';
    var Res =  this.auth.loginStorage();
    this.id_user =  Res.id_user;

    this.bConnected = Res.bConnected;
    this.bEmployer = Res.bEmployer;

    this.cv_id = this.cveditserv.getCvId();
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


    //console.log('this._cvitem', this._cvitem);

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
    //console.log('получили _cvitem', this._cvitem);


  }


  loadPrevious(id_cv: number) {
    this.cveditserv.getCvPrevious(id_cv).subscribe(curValue => {

      let cvP: any = curValue;
      cvP.forEach((cvP, ih) => {
        this._listPrevious.push({
          dStartDate: cvP.dStartDate,
          dCompletionDate: cvP.dCompletionDate,
          sCompany: cvP.sCompany,
          sPreviousPosition: cvP.sPreviousPosition,
          sInputPositionDescription: cvP.sInputPositionDescription
        });
      });

    });
  }

  loadLanguage(id_cv: number) {
    this.cveditserv.getCvLanguage(id_cv).subscribe(curValue => {

      let cvL: any = curValue;
      cvL.forEach((cvL, ih) => {
        this._listLanguage.push({
          id_cv: cvL.id_cv,
          id_language: cvL.id_language - 1,
          id_level: cvL.id_level - 1,
          language_name: staticGuideList.LanguageList[cvL.id_language - 1].name,
          language_level: staticGuideList.LevelLanguageList[cvL.id_level - 1].name
        });
      });

    });
  }


  onProfileClick($event) {
    //('profile');
  }

  ngOnDestroy() {
    if (typeof this.subscrDataUserFromId !== 'undefined') {
      this.subscrDataUserFromId.unsubscribe();
    }

    if (typeof this.dvSubscVacancy !== 'undefined') {
      this.dvSubscVacancy.unsubscribe();
    }

  }


  loadPicture(id_user: number) {

    this.sAvatarPath = '';

    this.subscrDataUserFromId = this.auth.getDataUserFromId(id_user).subscribe(value => {
      // вытаскиваем из базы картинку аватара
      this.loadUser = value[0] as UserType;
      //console.log('this.loadUser', this.loadUser);
      const S = this.loadUser.Avatar;

      if (this.loadUser.Avatar_Name === '' || this.loadUser.Avatar_Name === undefined || this.loadUser.Avatar_Name === null) this.sAvatarPath = '';
      else this.sAvatarPath = this.gr.sUrlAvatarGlobal + this.loadUser.Avatar_Name;


/*
      if (typeof S !== 'undefined') {
        if (S !== null) {
          if (S.length > 0) {
            this.base64textString.push('data:image/png;base64,' + JSON.parse(S).value);
          }
        }
      }
*/



    });
  }

  response(_cvitem: any) {


    this.errorResponse = '';
    //console.log('response',_cvitem);

    this.httpService.getCheckInvite(_cvitem.id, this.id_user, this.id_user).subscribe( (res) => {

      if (res[0].Res === 0) {
              this.dvSubscVacancy = this.moveS.setInvestCVID(_cvitem.id).subscribe(() => {
              this.router.navigate(['/invitation']);
        });
      } else {
              this.translate.get('cvhome.ts.sUseResp').subscribe(value => {
                this.errorResponse = value;
              });
      }
      //console.log('invitation');

    });
  }
////////////////////

}
