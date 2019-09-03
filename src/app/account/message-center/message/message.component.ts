import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {LetterService} from '../../../services/letter.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth-service.service';
import {UserType} from '../../../class/UserType';
import {Letter} from '../../../class/Letter';
import {DatePipe} from '@angular/common';
import {CvListService} from '../../../services/cv-list.service';
import {Router} from '@angular/router';
import {MoveService} from '../../../services/move.service';
import {CvEditService} from '../../../services/cv-edit.service';
import {isNull} from 'util';
import {TranslateService} from '@ngx-translate/core';
import {City} from '../../../class/City';
import {GuideService} from '../../../services/guide-service.service';
import {GlobalRef} from '../../../services/globalref';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy {

  public sAvatarPath : string = '';
  public messageSubscription: Subscription;
  public _letter: any;
  public form: FormGroup;
  public formResponse: FormGroup;
  public base64textString = [];
  public id_user = -1;
  private subscrDataUserFromId: Subscription;
  private loadUser: UserType;
  listLetter: any[] = [];
  public responseVC: string;
  public anyLetter: any;

  public deleteThread: boolean = false;
  public deleteCV: boolean = false;

  _sNameUserResp: string = '';
  _sName: string = '';
  _sLastName: string = '';

  _bEmployer: boolean = false;
  private dvMoveSubscription: Subscription;
  public anyVC: any;
  public sErrorResponse = '';


  constructor(private router: Router,
              private httpLetter: LetterService,
              private cveditserv: CvEditService,
              private auth: AuthService,
              private fb: FormBuilder,
              private moveS: MoveService,
              private cls: CvListService,
              private translate: TranslateService,
              public gr: GlobalRef,
              private gs: GuideService) {

    const Res =  this.auth.loginStorage();
    if (Res.bConnected) {
      this.id_user = Res.id_user;
    } else {
      this.id_user = -1; }

    this.createForm();

  }

          loadPictureAndListLetter(id_user: number) {

            this.sAvatarPath = '';
            this.base64textString = [];

            this.subscrDataUserFromId = this.auth.getDataUserFromId(id_user).subscribe(value => {
              // вытаскиваем из базы картинку аватара
              this.loadUser = value[0] as UserType;

              if (this.loadUser.bEmployer == true)
                this._bEmployer = true; else this._bEmployer = false;

              const S = this.loadUser.Avatar_Name;
              if (S !== '""') {
                if (typeof S !== 'undefined') {
                  if (S.length > 0) {
                    this.sAvatarPath = this.gr.sUrlAvatarGlobal + S;
                  }
                }
              }

        // TODO вставляем вызов всех сообщений для данного пользователя
          this.httpLetter.getThreadLetter(this._letter.id_cv, this._letter.id_vc).subscribe(
            curList => {

              this.listLetter = curList as any[];

/*
                  (curList as any[]).sort(
                  (a, b) => {
                    const DD1 = new Date(a.DateTimeCreate);
                    const DD2 = new Date(b.DateTimeCreate);
                    return +DD1 - +DD2;
                  });
*/

              // если есть список писем, из первого берем номер вакансии и ищем описание вакансии

              if (this.listLetter.length > 0) {

                //console.log('this.listLetter[0].id_vc',this.listLetter[0].id_vc);

                this.deleteThread = false;

                this.httpLetter.getAnyVcWithInvisible(this.listLetter[0].id_vc).subscribe(
                  anyValueVC => {

                    //console.log('anyValueVC',anyValueVC);

                    this.anyVC = anyValueVC;
                    if (this.anyVC !== undefined) {
                      if (this.anyVC[0] !== undefined) {

                        //console.log('this.anyVC',this.anyVC);

                        this.responseVC = this.anyVC[0].VacancyShortTitle;
                        this.deleteThread = this.anyVC[0].bInvisible;
                        //console.log('this.responseVC',this.anyVC);
                      } else this.responseVC = '';
                    } else {
                      this.responseVC = '';
                    }
                  });
              }

                });
            });
  }


  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      avatar: ''
    });

    this.formResponse = this.fb.group({
      textCommentValue: new FormControl('', [Validators.required, Validators.maxLength(3000)])
    });

  }


  parseLetter(anyLetter: any) {



//
// СМОТРИМ НА ПИСЬМО
//

      this.httpLetter.getUserName(anyLetter.id_user_from, anyLetter.id_user_to).subscribe((value) => {
        const arr = Object.values(value);

        const anyTempLetterFrom = arr.find(x => x.id === anyLetter.id_user_from);
        const anyTempLetterTo = arr.find(x => x.id === anyLetter.id_user_to);

        anyLetter.UserFrom = anyTempLetterFrom.UserName;
        anyLetter.UserTo = anyTempLetterTo.UserName;


        this._letter = anyLetter;

        //идет показ собеседника
        if (this.id_user == anyLetter.id_user_from) {
            this._sNameUserResp = anyTempLetterTo.UserName;
            this._sName = anyTempLetterTo.Name;
            this._sLastName = anyTempLetterTo.LastName;
            this.loadPictureAndListLetter(anyLetter.id_user_to);
        } else {
          this._sNameUserResp = anyTempLetterFrom.UserName;
          this._sName = anyTempLetterFrom.Name;
          this._sLastName = anyTempLetterFrom.LastName;
          this.loadPictureAndListLetter(anyLetter.id_user_from);
        }


       // console.log('this._sName',this._sName);
       // console.log('this._sLastName',this._sLastName);


        //получаем данные удаленно CV или нет
        this.httpLetter.getInfoCv(anyLetter.id_cv).subscribe( aRes =>
          {
            //console.log('aRes[0]',aRes[0]);
            this.deleteCV = aRes[0].bInvisible;
            this._letter = anyLetter;
          }
        );



      });

  }

  ngOnInit() {

    this.base64textString = [];
    this.messageSubscription = this.httpLetter.getLetter()
      .subscribe (oLetter => {
        if (typeof oLetter !== 'undefined') {
          this.anyLetter = oLetter;
          this.parseLetter(this.anyLetter);
        } else {
            if (window.localStorage.getItem('_letterid') !== null) {
              const lid = parseInt(window.localStorage.getItem('_letterid'), 10);
              this.httpLetter.getAnyLetter(lid).subscribe(curLetter => {
                  if (typeof curLetter[0] !== 'undefined') {
                    this.anyLetter = curLetter[0];
                    this.parseLetter(this.anyLetter);
                  }
                }
              );
            }
          }
      });
  }



  onProfileClick(event) {
    //console.log('$event', event);
  }

  ngOnDestroy() {
    if (typeof this.messageSubscription !== 'undefined') {
      this.messageSubscription.unsubscribe();
    }

    if (typeof this.dvMoveSubscription !== 'undefined') {
      this.dvMoveSubscription.unsubscribe();
    }

  }

  responseLetter() {
    // отправляем данные в таблицу  correspondence



    if (this.deleteCV) {
      this.translate.get('message.messageRUON').subscribe(
        value => this.sErrorResponse = value);
      return;
    }

    if (this.deleteThread) {
      this.translate.get('message.messageVSON').subscribe(
        value => this.sErrorResponse = value);
      return;
    }

    this.sErrorResponse = '';

  if (this.formResponse.invalid) {
      //console.log('');
      if (this.formResponse.get('textCommentValue').value.length>3000) {
        this.translate.get('message.messageSDT').subscribe(
          value => this.sErrorResponse = value);
      }
        else {
        this.translate.get('message.messagePOS').subscribe(
          value => this.sErrorResponse = value);
      }
      return;
  }

    const resResponse = this.formResponse.get('textCommentValue').value;
    const datePipe = new DatePipe('en-US');
    const currentDate = datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm');
    const Res: Letter = new Letter();
    Res.bOld = false;
    Res.bReadByRecipient = false;

    if (this.id_user !== this.anyLetter.id_user_from) {
      Res.id_user_from = this.anyLetter.id_user_to;
      Res.id_user_to = this.anyLetter.id_user_from;
    } else {
      Res.id_user_from = this.anyLetter.id_user_from;
      Res.id_user_to = this.anyLetter.id_user_to;
    }

    Res.id_cv =  this.anyLetter.id_cv;
    Res.id_vc = this.anyLetter.id_vc;


    Res.letterText = resResponse;
    Res.DateTimeCreate = currentDate;


    this.cls.setCorrespondence(Res).subscribe(
      () => {
        this.RouterReload();
      }
    );

  }

  RouterReload() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.navigated = false;

    this.router.navigate([this.router.url]);
  }


  onLoadFromBaseAvatar(k: any) {
    k.base64textString = [];
    if (k.Avatar !== undefined) {
      if (k.Avatar !== 'null') {
        if (k.Avatar !== null)  k.base64textString.push('data:image/png;base64,' + JSON.parse(k.Avatar).value);
      }
    }
  }

  public moveVC () {
    this.onLoadFromBaseAvatar(this.anyVC[0]);
    this.dvMoveSubscription = this.moveS.setDataVacancy(this.anyVC[0]).subscribe( ()=> this.router.navigate(['/vacancy-description']));
  }


  public moveCV() {
    this.cveditserv.getAnyCv(this.anyLetter.id_cv).subscribe(item =>{
      this.cveditserv.setCvId(item[0].id);

      this.gs.getCityTable().subscribe((value) => {
        let cityList = this.auth.loadLangCity(value as City[]);
        const sCityName = (cityList as City[]).find((valueC) => (valueC.id === parseInt(item[0].City.toString()))).name;
        item[0].CityName = sCityName;
        this.cveditserv.setCvItem(item[0]);
        this.router.navigate(['/cv-view']);

      });

    });


  }

}
