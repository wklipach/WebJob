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

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy {


  protected messageSubscription: Subscription;
  protected _letter: any;
  protected form: FormGroup;
  protected formResponse: FormGroup;
  protected base64textString = [];
  protected id_user = -1;
  private subscrDataUserFromId: Subscription;
  private loadUser: UserType;
  listLetter: any[] = [];
  protected responseVC: string;
  protected anyLetter: any;


  constructor(private router: Router,
              private httpLetter: LetterService,
              private auth: AuthService,
              private fb: FormBuilder,
              private cls: CvListService) {

    const Res =  this.auth.loginStorage();
    if (Res.bConnected) {
      this.id_user = Res.id_user;
    } else {
      this.id_user = -1; }

    this.createForm();

  }

          loadPicture(id_user: number) {
            this.subscrDataUserFromId = this.auth.getDataUserFromId(id_user).subscribe(value => {
              // вытаскиваем из базы картинку аватара



              this.loadUser = value as UserType;
              const S = this.loadUser['Avatar'].Avatar;
              if (typeof S !== 'undefined') {
                if (S.length > 0) { this.base64textString.push('data:image/png;base64,' + JSON.parse(S).value); }
              }

        // TODO вставляем вызов прочих сообщений для данного пользователя (первое сообщение следует не печатать при начальной загрузке)
          this.httpLetter.getThreadLetter(this._letter.letter.id_cv, this._letter.letter.id_vc).subscribe(
            curList => {
              this.listLetter =
                  (curList as any[]).sort(
                  (a, b) => {
                    const DD1 = new Date(a.letter.DateTimeCreate);
                    const DD2 = new Date(b.letter.DateTimeCreate);
                    return +DD1 - +DD2;
                  });

              // если есть список писем, из первого берем номер вакансии и ищем описание вакансии

              if (this.listLetter.length > 0) {
                this.httpLetter.getAnyVC(this.listLetter[0].letter.id_vc).subscribe(
                  anyValueVC => {
                    const anyVC: any = anyValueVC;
                    if (typeof anyVC !== undefined) {
                      console.log('anyVC', anyVC);
                      this.responseVC = anyVC.vacancy.VacancyShortTitle;
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
      textCommentValue: new FormControl('')
    });

  }


  parseLetter(anyLetter: any) {
      this.httpLetter.getUserName(anyLetter.letter.id_user_from, anyLetter.letter.id_user_to).subscribe((value) => {
        const arr = Object.values(value);
        anyLetter.UserFrom = arr.find(x => x.id === anyLetter.letter.id_user_from).UserName;
        anyLetter.UserTo = arr.find(x => x.id === anyLetter.letter.id_user_to).UserName;
        this._letter = anyLetter;
        this.loadPicture(anyLetter.letter.id_user_from);
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
                    console.log('anyLetter', this.anyLetter);
                    this.parseLetter(this.anyLetter);
                  }
                }
              );
            }
          }
      });
  }



  onProfileClick(event) {
    console.log('$event', event);
  }

  ngOnDestroy() {
    if (typeof this.messageSubscription !== 'undefined') {
      this.messageSubscription.unsubscribe();
    }
  }

  responseLetter() {
    console.log('response');
    // отправляем данные в таблицу  correspondence
    console.log('textCommentValue', this.formResponse.get('textCommentValue').value);
    const resResponse = this.formResponse.get('textCommentValue').value;

    const datePipe = new DatePipe('en-US');
    const currentDate = datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm');
    const Res: Letter = new Letter();
    Res.bOld = false;
    Res.bReadByRecipient = false;
    Res.id_user_from = this.id_user;
    Res.id_cv =  this.anyLetter.letter.id_cv;
    Res.id_vc = this.anyLetter.letter.id_vc;
    if (this.id_user !== this.anyLetter.letter.id_user_to) {
      Res.id_user_to = this.anyLetter.letter.id_user_to;
    } else {
      Res.id_user_to = this.anyLetter.letter.id_user_from;
    }
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


  moveCV() {
    console.log('Переходим к резюме!!!!');
  }

}
