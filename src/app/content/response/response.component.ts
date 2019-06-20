import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableVacancyService} from '../../services/table-vacancy.service';
import {City} from '../../class/City';
import {CvListService} from '../../services/cv-list.service';
import {GuideService} from '../../services/guide-service.service';
import {Subscription} from 'rxjs';
import {CvEditService} from '../../services/cv-edit.service';
import {AuthService} from '../../services/auth-service.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Letter} from '../../class/Letter';
import {Router} from '@angular/router';
import {VacanciesListService} from '../../services/vacancies-list.service';
import {Vacancy} from '../../class/Vacancy';
import {DatePipe} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.css']
})
export class ResponseComponent implements OnInit, OnDestroy {

  private curVc: any;
  private _id_user: number;
  private _id_vc: number;
  protected cvList: any;
  protected cityList: City[];
  protected modelResumeFromCheck = {resumeFromCheck: ''};
  protected bErrorResumeCheck = false;
  protected bErrorResumeLetter = false;

  private cvResponseGetCvList: Subscription;
  private cvResponseCity: Subscription;

  protected formResponse: FormGroup;

  constructor(
              private router: Router,
              private  gs: GuideService,
              private cls: CvListService,
              private cvEditSrv: CvEditService,
              private authService: AuthService,
              private fb: FormBuilder,
              private vls: VacanciesListService,
              public translate: TranslateService) {

    this.formResponse = this.fb.group({
      textCommentValue: new FormControl('')
    });


  }

  ngOnInit() {

    const Res =  this.authService.loginStorage();
    this._id_user =  Res.id_user;
    this._id_vc = this.cvEditSrv.getCvId();


    // получаем id_user  из вакансии
    this.vls.getVc(this._id_vc).subscribe((value) => {
      this.curVc = value[0] as Vacancy;
      console.log('this.curVc', this.curVc);
    })

console.log('this._id_user','!!!!!');

console.log('this._id_user',this._id_user);

   // получаем список резюме пользователя в cvList
    this.cvResponseCity = this.gs.getCityTable().subscribe((value) => {
      this.cityList = value as City[];
// console.log('this a1 value', value);
      this.cvResponseGetCvList = this.cls.getCvList(this._id_user).subscribe((value0) => {
          this.cvList = value0;

// console.log('this a2',value0);

          if (this.cvList.length === 1) {
            this.modelResumeFromCheck.resumeFromCheck = this.cvList[0].id;
          }

//console.log('this a3');

          this.cvList.forEach( (cvCur, index) => {
            const sCityName = (this.cityList as City[]).find( value1 =>
              (value1.id === parseInt(cvCur.City.toString()) )).name;
            this.cvList[index].CityName = sCityName;

            // this.modelResumeFromCheck.resumeFromCheck = this.cvList[index].id;

          });
        }
      );
    }
    );
  }

  ngOnDestroy() {
    if (typeof  this.cvResponseGetCvList !== 'undefined') {
      this.cvResponseGetCvList.unsubscribe();
    }

    if (typeof  this.cvResponseCity !== 'undefined') {
      this.cvResponseCity.unsubscribe();
    }

  }

  MoveResult() {

    this.bErrorResumeCheck = false;
    this.bErrorResumeLetter = false;

    if (this.modelResumeFromCheck.resumeFromCheck === '') {
      this.bErrorResumeCheck = true;
      return;
    }

    const strLetter = this.formResponse.get('textCommentValue').value;

    if (strLetter === '') {
      this.bErrorResumeLetter = true;
      return;
    }

    // отправляем данные в таблицу  correspondence
    console.log('textCommentValue', this.formResponse.get('textCommentValue').value);

    const datePipe = new DatePipe('en-US');
    const currentDate = datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm');
    const Res: Letter = new Letter();
    Res.bOld = false;
    Res.bReadByRecipient = false;
    Res.id_user_from = this._id_user;
    Res.id_cv =  parseInt(this.modelResumeFromCheck.resumeFromCheck, 10);
    Res.id_vc = this._id_vc;


    console.log('this.curVc', this.curVc);

    Res.id_user_to = this.curVc.id_user;


    Res.letterText = strLetter;
    Res.DateTimeCreate = currentDate;



    this.cls.setCorrespondence(Res).subscribe(
      () => {
        this.router.navigate(['/smain']);
      }
    );


  }

}
