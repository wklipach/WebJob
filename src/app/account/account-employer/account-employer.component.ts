import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {City} from '../../class/City';
import {GuideService} from '../../services/guide-service.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth-service.service';
import {UserType} from '../../class/UserType';
import {Router} from '@angular/router';

@Component({
  selector: 'app-accountemployer',

  templateUrl: './account-employer.component.html',
  styleUrls: ['./account-employer.component.css']

})
export class AccountEmployerComponent implements OnInit {

  accountEmployerForm: FormGroup;
  listCity: City[] = [];
  private cveditCityTable: Subscription;
  private subscrDataUserFromId: Subscription;
  private _myDisplayCity: string;
  private id_user: number = -1;
  private _sEmail: string = '';
  private _sPassword: string = '';

  public bPasswordNew: boolean = false;
  private loadUser: UserType;

  public bShowChangePassword: boolean = false;
  public bErrorRepeatPassword: boolean = false;


  constructor(private is: GuideService,

              private auth: AuthService,
              private router: Router,
              private gs: GuideService) {


    this.accountEmployerForm = new FormGroup({

      'inputUserName': new FormControl({value: '', disabled: true}, []),
      'inputName': new FormControl(),
      'inputLastName' : new FormControl(),
      'inputZip' : new FormControl(),
      'inputAddress' : new FormControl(),
      'inputPhone' : new FormControl(),
      'inputCity' : new FormControl(),
      'inputNewPassword1' : new FormControl('',[]),
      'inputNewPassword2' : new FormControl('',[])
    });

  }

  ngOnInit() {

    var Res =  this.auth.loginStorage();

    if (Res.bConnected) this.id_user = Res.id_user; else this.id_user = -1;

    this.subscrDataUserFromId =
      this.auth.getDataUserFromId(this.id_user).subscribe(value =>
       {
         this.loadCurrentUserInfo(value);
         this.loadUser = value as UserType;
         console.log('this.loadUser',this.loadUser);

        }

      );

    }

  ngOnDestroy() {

    if (typeof  this.subscrDataUserFromId !== 'undefined') {
      this.subscrDataUserFromId.unsubscribe();
    }


  }

  loadCurrentUserInfo(item: any) {

    // редактируемый список городов по подписке с выбранным ранее городом в    качестве выбранного


    this.cveditCityTable = this.is.getCityTable().subscribe(

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
        this.accountEmployerForm.controls['inputCity'].setValue(this._myDisplayCity);

        if (typeof item.Zip !== 'undefined') {
          this.accountEmployerForm.controls['inputZip'].setValue(item.Zip);
        }
        if (typeof item.UserName !== 'undefined') {
          this.accountEmployerForm.controls['inputUserName'].setValue(item.UserName);
        }

        if (typeof item.Name !== 'undefined') {
          this.accountEmployerForm.controls['inputName'].setValue(item.Name);
        }

        if (typeof item.LastName !== 'undefined') {
         this.accountEmployerForm.controls['inputLastName'].setValue(item.LastName);
        }
        if (typeof item.Address !== 'undefined') {
          this.accountEmployerForm.controls['inputAddress'].setValue(item.Address);

        }
        if (typeof item.Phone !== 'undefined') {
          this.accountEmployerForm.controls['inputPhone'].setValue(item.Phone);
        }
        if (typeof item.EMail !== 'undefined') this._sEmail = item.EMail;
        if (typeof item.Password !== 'undefined') this._sPassword =
          item.Password;
      }

    );
  }

  savecv() {

    var id_city = -1;

    const {inputUserName, inputName, inputLastName, inputZip, inputAddress,
      inputPhone, inputCity} = this.accountEmployerForm.value;


    this.gs.getCityId(inputCity).subscribe( (value: City) => {

      if (typeof value[0].id  !== 'undefined') {id_city = value[0].id;}

      const AddUser  = new UserType(inputUserName, this._sEmail,
        this._sPassword,

        true, id_city, inputZip, inputName, inputLastName, inputAddress,
        inputPhone);

      return this.auth.updateDataUserTable(AddUser, this.id_user).subscribe(

        () => {

          this.router.navigate(['/']); }

      );

    });
  }

  NewPassword() {
    const {inputNewPassword1: inputNewPassword1, inputNewPassword2: inputNewPassword2} = this.accountEmployerForm.value;


    if (inputNewPassword1 === inputNewPassword2) this.bErrorRepeatPassword = false;
    else this.bErrorRepeatPassword = true;

    if (inputNewPassword1 === inputNewPassword2) {
      this.loadUser.Password = inputNewPassword1;
      console.log('this.loadUser', this.loadUser);
      return this.auth.updateDataUserTable(this.loadUser, this.id_user).subscribe(
        () => {
          this.bPasswordNew = true;
        }
      );
    }
  }


  accessPassword() {
    this.bShowChangePassword = !this.bShowChangePassword;
 }

  back() {

    this.router.navigate(['/']);

  }

}
