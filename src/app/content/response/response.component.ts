import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.css']
})
export class ResponseComponent implements OnInit {

  private curVc: any;
  private _id_user: number;
  private _id_vc: number;
  protected cvList: any;
  protected cityList: City[];
  protected modelResumeFromCheck = {resumeFromCheck: ""};
  protected bErrorResumeCheck = false;
  protected bErrorResumeLetter = false;

  private cvResponseGetCvList: Subscription;
  private cvResponseCity: Subscription;

  protected formResponse: FormGroup;

  constructor(
              private router: Router,
              private  gs: GuideService,
              private cls : CvListService,
              private cvEditSrv: CvEditService,
              private authService: AuthService,
              private fb: FormBuilder,
              private vls: VacanciesListService) {

    this.formResponse = this.fb.group({
      textCommentValue: new FormControl('')
    })


  }

  ngOnInit() {

    var Res =  this.authService.loginStorage();
    this._id_user =  Res.id_user;
    this._id_vc = this.cvEditSrv.getCvId();

    //получаем id_user  из вакансии
    this.vls.getVc(this._id_vc).subscribe((value)=>{
      this.curVc = value as Vacancy;
      console.log('this.curVc',this.curVc);
    })


   // console.log('this._id_user',this._id_user);

   //получаем список резюме пользователя в cvList
    this.cvResponseCity = this.gs.getCityTable().subscribe((value) => {
      this.cityList = value as City[];
      this.cvResponseGetCvList = this.cls.getCvList(this._id_user).subscribe((value) =>
        {
          this.cvList = value;
          this.cvList.forEach( (cvCur, index) => {
            let sCityName = (this.cityList as City[]).find((value) => (value.id === cvCur.cv.City) ).name;
            this.cvList[index].CityName = sCityName;
          });
        }
      )}
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

    console.log('cvList', this.cvList);
    console.log('modelResumeFromCheck.resumeFromCheck', this.modelResumeFromCheck.resumeFromCheck);

    if (this.modelResumeFromCheck.resumeFromCheck === '') {
      this.bErrorResumeCheck = true;
      return;
    }

    let strLetter = this.formResponse.get('textCommentValue').value;

    if (strLetter === '') {
      this.bErrorResumeLetter = true;
      return;
    }

    //отправляем данные в таблицу  correspondence
    console.log('textCommentValue', this.formResponse.get('textCommentValue').value);

    var datePipe = new DatePipe("en-US");
    var currentDate = datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm');
    let Res: Letter = new Letter();
    Res.bOld = false;
    Res.bReadByRecipient = false;
    Res.id_user_from = this._id_user;
    Res.id_cv =  parseInt(this.modelResumeFromCheck.resumeFromCheck);
    Res.id_vc = this._id_vc;
    Res.id_user_to = this.curVc.vacancy.id_user;
    Res.letterText = strLetter;
    Res.DateTimeCreate = currentDate;



    this.cls.setCorrespondence(Res).subscribe(
      () => {
        this.router.navigate(['/home']);
      }
    );


  }

}
