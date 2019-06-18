import { Component, OnInit, OnDestroy } from '@angular/core';
import {UserType} from '../../class/UserType';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth-service.service';
import {City} from '../../class/City';
import {GuideService} from '../../services/guide-service.service';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-about-company',
  templateUrl: './about-company.component.html',
  styleUrls: ['./about-company.component.css']
})
export class AboutCompanyComponent implements OnInit, OnDestroy {


  private subscrAboutCompanyFromId: Subscription;
  private aboutCityTable: Subscription;
  private loadUser: UserType;
  listCity: City[] = [];
  protected _myDisplayCity: string;
  protected base64textString = [];
  protected _myZip: string;
  protected _myUserName: string;
  protected _myName: string;
  protected _myAddress: string;
  protected _myPhone: string;
  protected _myEmail: string;
  protected _myPhone2: string;
  protected _myWeb: string;
  protected _myAbout: string;
  protected _myContactPerson: string;
  protected _myLastName: string;


  constructor(private auth: AuthService, private is: GuideService, public translate: TranslateService) { }

  ngOnInit() {
    const id_user = parseInt(window.localStorage.getItem('about_user'));
    this.subscrAboutCompanyFromId =
      this.auth.getDataUserFromId(id_user).subscribe(value =>
        {
          this.loadCurrentUserInfo(value[0]);
          this.loadUser = value[0] as UserType;
          // вытаскиваем из базы картинку аватара
          const S = this.loadUser.Avatar;
          if (S.toString().length>0) {
            this.base64textString.push('data:image/png;base64,' + JSON.parse(S).value);
          }
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
        }

        if (typeof item.ContactPerson !== 'undefined') {
          this._myContactPerson = item.ContactPerson;
        }
      }
    );
  }



}
