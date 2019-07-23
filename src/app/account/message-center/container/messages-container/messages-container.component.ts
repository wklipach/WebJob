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
  public id_user = -1;
  private bEmployer = false;
  public myDataLetter: any;
  private sbscTableLetter: Subscription;
  private letterSubscription: Subscription;
  contactMethods = [];

  constructor (private authService: AuthService,
               private httpLetter: LetterService,
               protected router: Router,
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
          console.log('this.myDataLetter',this.myDataLetter);


          this.myDataLetter.forEach( (cvDL, index) => {
            this.contactMethods.push({'id': 0, value: 0, 'bDelete': false});
          });
        }

      });
  }

  RouterReload() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.navigated = false;

    this.router.navigate([this.router.url]);
  }

  curDeleteClick(i, id_cv: number, id_vc: number, $event) {


    this.contactMethods[i].bDelete = true;
//
//    this.httpLetter.setDeleteGroupLetter(id_cv, id_vc).subscribe(value => {
//      this.RouterReload();
//      });

  }


  curLetterClick(lid, id_cv, id_vc: number, curId_user_to: number, $event) {


    // console.log('curletter event', curId_user_to);

    if (($event.target.id === 'trash') || ($event.target.id === 'btnUnDelete') || ($event.target.id === 'btnDelete') || ($event.target.id === 'frameDelete')) return;


    //есди это получатель письма делаем данное письмо прочитанным (ставим признак bOld)
    if (this.id_user === curId_user_to) {

      console.log('СДЕЛАЛИ ТОЛСТЫМ');

      this.httpLetter.setOldGroupLetter(id_cv, id_vc, this.id_user).subscribe(value => {
        this.OpenFirstElement(id_cv, id_vc, lid, true);
      });
    } else {
      //если это не получатель (а например сам отправитель перепросматривает письмо) то просто открываем
      console.log('ОСТАВИЛИ ХУДЫМ');
      this.OpenFirstElement(id_cv, id_vc, lid, false);
    }



  }

  OpenFirstElement(id_cv : number, id_vc : number, lid : number, bSetRead: boolean) {
    this.httpLetter.getFirstLetter(id_cv, id_vc).subscribe(
      (data: any) => {
        let letter: Letter = data[0];

        if (typeof letter !== 'undefined') {
          //заодно закидываем идентификатор письма в хранилище
          window.localStorage.setItem('_letterid', JSON.stringify(lid));

          //ставим или не ставим пометку Прочитанное
          if (bSetRead) {
            this.letterSubscription = this.httpLetter.setLetter(letter).subscribe(() => this.router.navigate(['/message']));
          }  else {
            this.router.navigate(['/message']);}
        }
      });

  }



  DeleteElement(curLetter,i) {
    this.httpLetter.setDeleteGroupLetter(curLetter.id_cv, curLetter.id_vc).subscribe(value => {
      this.RouterReload();
      });
  }

  UnDeleteElement(curLetter,i) {
    this.contactMethods[i].bDelete = false;
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
