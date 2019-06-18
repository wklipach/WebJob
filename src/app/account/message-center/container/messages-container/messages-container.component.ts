import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../../services/auth-service.service';
import {LetterService} from '../../../../services/letter.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Letter} from '../../../../class/Letter';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html',
  styleUrls: ['./messages-container.component.css']
})
export class MessagesContainerComponent implements OnInit {

  @Input() public  isGroup: boolean = false;
  private bConnected = false;
  protected id_user = -1;
  private bEmployer = false;
  protected myDataLetter: any;
  private sbscTableLetter: Subscription;
  private letterSubscription: Subscription;

  constructor (private authService: AuthService,
               private httpLetter: LetterService,
               private router: Router,
               public translate: TranslateService) {

    var Res =  this.authService.loginStorage();
    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;
    this.bEmployer = Res.bEmployer;
    this.myDataLetter = [];
  }

  ngOnInit() {

    return this.sbscTableLetter = this.httpLetter.getListLetterGroup(this.id_user, this.isGroup).subscribe(
      (data: any) => {

        if (data.length>0) {
          this.myDataLetter = [];
          this.myDataLetter = data; //data[0].concat(data[1]);
        }

      });
  }


  curLetterClick(lid: number, $event) {

    //делаем данное письмо прочитанным (ставим признак bOld)
    this.httpLetter.setOldLetter(lid).subscribe(value => {

      //ищем первое письмо в общении данных пользователей

      console.log('value[0]', value);

      this.httpLetter.getFirstLetter(value[0].id_cv, value[0].id_vc).subscribe(
        (data: any) => {
          let letter: Letter = data[0];

          if (typeof letter !== 'undefined') {
            //заодно закидываем идентификатор письма в хранилище
            window.localStorage.setItem('_letterid', JSON.stringify(lid));
            this.letterSubscription = this.httpLetter.setLetter(letter).subscribe(() => this.router.navigate(['/message']));
          }
        });
    });

  }

  ngOnDestroy() {

    if (typeof this.sbscTableLetter !== 'undefined') {
      this.sbscTableLetter.unsubscribe();
    }

    if (typeof this.letterSubscription !== 'undefined') {
      this.letterSubscription.unsubscribe();
    }

  }


}
