import {Component, OnDestroy, OnInit} from '@angular/core';
import {MoveService} from '../../services/move.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {City} from '../../class/City';
import {AuthService} from '../../services/auth-service.service';
import {GuideService} from '../../services/guide-service.service';
import {VacanciesListService} from '../../services/vacancies-list.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Letter} from '../../class/Letter';
import {CvEditService} from '../../services/cv-edit.service';
import {CvListService} from '../../services/cv-list.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.css']
})
export class InvitationComponent implements OnInit, OnDestroy {

  protected cvidSubscription: Subscription;
  private id_user: number;
  private  bConnected: boolean;
  private sbVacCity: Subscription;
  private sbVacanciesGetList: Subscription;
  public vacanciesList: any;
  public formResponse: FormGroup;
  public bErrorResumeCheck = false;
  public bErrorResumeLetter = false;
  public modelResumeFromCheck = {resumeFromCheck: ''};
  public  cityList: City[];
  public cvid: number;




  constructor(private moveS: MoveService,
              private authService: AuthService,
              private router: Router,
              private  gs: GuideService,
              private fb: FormBuilder,
              private cves: CvEditService,
              private cls: CvListService,
              private gls: VacanciesListService,
              public translate: TranslateService) {

    this.formResponse = this.fb.group({
      textCommentValue: new FormControl('')
    });

  }

  ngOnInit() {
    this.cvidSubscription = this.moveS.getInvestCVID().subscribe( (value) => {
      console.log('value', value);

      if (value === undefined) {
        this.router.navigate(['/smain']);
      } else { this.loadInit(value);   }

      });
  }

  ngOnDestroy() {
    if (typeof this.cvidSubscription !== 'undefined') {
      this.cvidSubscription.unsubscribe();
    }

    if (typeof  this.sbVacCity !== 'undefined') {
      this.sbVacCity.unsubscribe();
    }

    if (typeof  this.sbVacanciesGetList !== 'undefined') {
      this.sbVacanciesGetList.unsubscribe();
    }



  }


  loadInit(cvid: number) {
    const Res =  this.authService.loginStorage();
    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;
    this.cvid = cvid;


    this.sbVacCity = this.gs.getCityTable().subscribe((value) => {
      this.cityList = value as City[];

      this.sbVacanciesGetList = this.gls.getVacanciesList(this.id_user).subscribe((valueVL) => {
        this.vacanciesList = valueVL;

        this.vacanciesList.forEach( (vacCur, index) => {
          // this.contactMethods.push({'id' : 0, value : 0, 'bDelete': false});

          const sCityName = (this.cityList as City[]).find((valueC) => (valueC.id === parseInt(vacCur.City.toString()) ) ).name;

          this.vacanciesList[index].CityName = sCityName;

        });
      });
    });
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
    Res.id_user_from = this.id_user;
    Res.id_cv = this.cvid;
    Res.id_vc =  parseInt(this.modelResumeFromCheck.resumeFromCheck, 10);


    Res.id_user_to = -1; // this.curVc.id_user;
    Res.letterText = strLetter;
    Res.DateTimeCreate = currentDate;

    this.cves.getAnyCv(this.cvid).subscribe( (anyCV) =>  {

      if (anyCV[0].id_user !== undefined) {
        Res.id_user_to = anyCV[0].id_user;

        this.cls.setCorrespondence(Res).subscribe(
          () => {
            this.router.navigate(['/smain']);
          });
      }
      });
  }


}
