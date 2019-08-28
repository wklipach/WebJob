import { Component, OnInit, OnDestroy } from '@angular/core';
import {UserType} from '../../class/UserType';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth-service.service';
import {City} from '../../class/City';
import {GuideService} from '../../services/guide-service.service';
import {TranslateService} from '@ngx-translate/core';
import {GlobalRef} from '../../services/globalref';


@Component({
  selector: 'app-about-company',
  templateUrl: './about-company.component.html',
  styleUrls: ['./about-company.component.css']
})
export class AboutCompanyComponent implements OnInit, OnDestroy {


  public sAvatarPath : string = '';
  private subscrAboutCompanyFromId: Subscription;
  private aboutCityTable: Subscription;
  private loadUser: UserType;
  listCity: City[] = [];
  public _myDisplayCity: string  = '';
  public base64textString = [];
  public _myZip: string  = '';
  public _myUserName: string  = '';
  public _myName: string  = '';
  public _myAddress: string  = '';
  public _myPhone: string  = '';
  public _myEmail: string  = '';
  public _myPhone2: string  = '';
  public _myWeb: string  = '';
  public _myAbout: string  = '';
  public _myContactPerson: string  = '';
  public _myLastName: string  = '';


  constructor(private auth: AuthService,
              private is: GuideService,
              public translate: TranslateService,
              public gr: GlobalRef) { }

  ngOnInit() {
    this.sAvatarPath = '';
    const id_user = parseInt(window.localStorage.getItem('about_user'));
    this.subscrAboutCompanyFromId =
      this.auth.getDataUserFromId(id_user).subscribe(value =>
        {
          this.loadCurrentUserInfo(value[0]);
          this.loadUser = value[0] as UserType;

                // вытаскиваем из базы картинку аватара

          if (this.loadUser.Avatar_Name === '' || this.loadUser.Avatar_Name === undefined || this.loadUser.Avatar_Name === null) this.sAvatarPath = '';
          else this.sAvatarPath = this.gr.sUrlAvatarGlobal + this.loadUser.Avatar_Name;


/*
          if (this.loadUser !== undefined) {
                const S = this.loadUser.Avatar;
                if (S.toString().length>0) {
                  if (S.toString() !== 'null') {
                    this.base64textString.push('data:image/png;base64,' + JSON.parse(S).value);
                  }
                }
          }
*/




        }
      );

  }

  ngOnDestroy() {

    if (typeof  this.subscrAboutCompanyFromId !== 'undefined') {
      this.subscrAboutCompanyFromId.unsubscribe();
    }

    if (typeof  this.aboutCityTable !== 'undefined') {
      this.aboutCityTable.unsubscribe();
    }

  }


  loadCurrentUserInfo(item: any) {


    if (item===undefined) return;

    // редактируемый список городов по подписке с выбранным ранее городом в    качестве выбранного
    this.aboutCityTable = this.is.getCityTable().subscribe(

      (data: City[]) => {
        this.listCity = data;

        if (typeof item.City !== 'undefined') {

          if (item.City !== -1) {

            if (this.listCity.length > 0) this._myDisplayCity =
              this.listCity[item.City - 1].name;

          } else if (this.listCity.length > 0) this._myDisplayCity =
            this.listCity[0].name;

        } else {

          if (this.listCity.length > 0) this._myDisplayCity =
            this.listCity[0].name;
        }

        if (typeof item.Zip !== 'undefined') {
          this._myZip = item.Zip;
        }
        if (typeof item.UserName !== 'undefined') {
          this._myUserName = item.UserName;
        }

        if (typeof item.Name !== 'undefined') {
          this._myName = item.Name;
        }

        if (typeof item.LastName !== 'undefined') {
          this._myLastName = item.LastName;
        }
        if (typeof item.Address !== 'undefined') {
          this._myAddress = item.Address;
        }
        if (typeof item.Phone !== 'undefined') {
          this._myPhone = item.Phone;
        }
        if (typeof item.EMail !== 'undefined') {
          this._myEmail = item.EMail;
        }

        if (typeof item.Phone2 !== 'undefined') {
          this._myPhone2 = item.Phone2;
        }

        if (typeof item.Web !== 'undefined') {
          this._myWeb = item.Web;
        }

        if (typeof item.About !== 'undefined') {
          this._myAbout = item.About;
          //console.log('this._myAbout',this._myAbout);
        }

        if (typeof item.ContactPerson !== 'undefined') {
          this._myContactPerson = item.ContactPerson;
        }


        //console.log('this._myDisplayCity', this._myDisplayCity);


      }
    );
  }



}
