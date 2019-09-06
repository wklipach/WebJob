import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CheckpostService} from '../../services/checkpost.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth-service.service';
import {GlobalRef} from '../../services/globalref';

@Component({
  selector: 'app-postmoder-cv',
  templateUrl: './postmoder-cv.component.html',
  styleUrls: ['./postmoder-cv.component.css']
})
export class PostmoderCvComponent implements OnInit, OnDestroy {

  public cvList: any = [];

  public sEducation: string = '';
  public sSkills: string = '';
  public sExperience: string = '';
  public sPosition: string = '';

  public sUserName: string = '';
  public sEMail: string = '';
  public sAvatar_Name: string = '';
  public sZip: string = '';
  public sName: string = '';
  public sContactPerson: string = '';
  public sLastName: string = '';
  public sAddress: string = '';
  public sPhone: string = '';
  public sPhone2: string = '';
  public sWeb: string = '';
  public sAbout: string = '';


  public sbDeleteCv: Subscription;
  public sbscrApplyAllCv: Subscription;
  public sbscrDeleteAll: Subscription;
  public sbscrME: Subscription;




  public id_user: number = -1;
  public sAvatarPath : string = '';

  constructor(public authService : AuthService,
              public checkpostservice: CheckpostService,
              public gr: GlobalRef,
              private router: Router) { }

  ngOnInit() {
    var Res =  this.authService.loginStorage();
    this.id_user =  Res.id_user;

    this.sbscrME =  this.checkpostservice.getCheckPostCv().subscribe(value =>
    {
      if (value !== undefined && value !== null)  {
        (value as any[]).forEach( (CV, index) => {

          this.cvList = value;

        });
      }
    });
  }


  ulClick($event, item: any, i: number) {
    if ($event.target.id !== "BTN" && $event.target.id !== "BTNDELETEALL") {

      if (item !== null && item != undefined) {

        this.sEducation = '';
        this.sSkills = '';
        this.sExperience = '';
        this.sPosition = '';

        this.sUserName = '';
        this.sEMail = '';
        this.sAvatar_Name = '';
        this.sZip = '';
        this.sName = '';
        this.sContactPerson = '';
        this.sLastName = '';
        this.sAddress = '';
        this.sPhone = '';
        this.sPhone2 = '';
        this.sWeb = '';
        this.sAbout = '';

        this.sAvatarPath = '';

        const S = item.Avatar_Name;
        if (S !== '""' && S !== null) {
          if (typeof S !== 'undefined') {
            if (S.length > 0) {
              this.sAvatarPath = this.gr.sUrlAvatarGlobal + S;
            }
          }
        }


        if (item.sEducation !== undefined && item.sEducation !==  null) this.sEducation = item.sEducation;
        if (item.Skills !== undefined && item.Skills !==  null) this.sSkills = item.Skills;
        if (item.sExperience !== undefined && item.sExperience !==  null) this.sExperience = item.sExperience;
        if (item.Position !== undefined && item.Position !==  null) this.sPosition = item.Position;

        if (item.UserName !== undefined && item.UserName !==  null) this.sUserName = item.UserName;
        if (item.EMail !== undefined && item.EMail !==  null) this.sEMail = item.EMail;
        if (item.Avatar_Name !== undefined && item.Avatar_Name !==  null) this.sAvatar_Name = item.Avatar_Name;
        if (item.Zip !== undefined && item.Zip !==  null) this.sZip = item.Zip;
        if (item.Name !== undefined && item.Name !==  null) this.sName = item.Name;
        if (item.ContactPerson !== undefined && item.ContactPerson !==  null) this.sContactPerson = item.ContactPerson;
        if (item.LastName !== undefined && item.LastName !==  null) this.sLastName = item.LastName;
        if (item.Address !== undefined && item.Address !==  null) this.sAddress = item.Address;
        if (item.Phone !== undefined && item.Phone !==  null) this.sPhone = item.Phone;
        if (item.Phone2 !== undefined && item.Phone2 !==  null) this.sPhone2 = item.Phone2;
        if (item.Web !== undefined && item.Web !==  null) this.sWeb = item.Web;
        if (item.About !== undefined && item.About !==  null) this.sAbout = item.About;
      }
    }
  }

  DeleteElement($event, item: any, i: number) {
    //console.log('удаляем', $event.target);

    this.sbDeleteCv = this.checkpostservice.setDeleteCv(item.id).subscribe( value=> {
        this.RouterReload();
      },
      err => console.log('при  удалении СV возникла нештатная ситуация ', err));
  }

  DeleteAll($event, item,i) {
    //console.log('удалить все физически');


    console.log(item);

    if (item === null || item === undefined) return;
    if (item.id_user === null || item.id_user === undefined) return;


    //кто удаляет
    //console.log('id_user_action', this.id_user);
    //кого удаляет
    //console.log('id_user_delete', item.id_user);


    this.sbscrDeleteAll = this.checkpostservice.setDeleteAll(this.id_user,item.id_user).subscribe(value => {
        this.RouterReload();
      },
      err => console.log('при удалении всех данных возникла нештатная ситуация ', err));
  }

  RouterReload() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.navigated = false;

    this.router.navigate([this.router.url]);
  }

  applyAll() {
    //console.log('принимаем все');
    this.sbscrApplyAllCv = this.checkpostservice.setApplyAllCv().subscribe( value=> {
        this.RouterReload();
      },
      err => console.log('при приеме всех CV возникла нештатная ситуация ', err));
  }


  ngOnDestroy() {

    if (typeof  this.sbscrME !== 'undefined') {
      this.sbscrME.unsubscribe();
    }

    if (typeof  this.sbDeleteCv !== 'undefined') {
      this.sbDeleteCv.unsubscribe();
    }

    if (typeof  this.sbscrDeleteAll !== 'undefined') {
      this.sbscrDeleteAll.unsubscribe();
    }

    if (typeof  this.sbscrApplyAllCv !== 'undefined') {
      this.sbscrApplyAllCv.unsubscribe();
    }

  }
}
