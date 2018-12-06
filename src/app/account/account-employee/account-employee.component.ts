import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {City} from '../../class/City';
import {GuideService} from '../../services/guide-service.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth-service.service';
import {UserType} from '../../class/UserType';
import {Router} from '@angular/router';

@Component({
  selector: 'app-accountemployee',
  templateUrl: './account-employee.component.html',
  styleUrls: ['./account-employee.component.css']
})
export class AccountEmployeeComponent implements OnInit {

  base64textString = [];
  loading: boolean = false;
  form: FormGroup;
  accountEmployeeForm: FormGroup;
  listCity : City[] =[];
  private cveditCityTable: Subscription;
  private subscrDataUserFromId: Subscription;
  private _myDisplayCity: string;
  private id_user: number = -1;
  private _sEmail: string = '';
  private _sPassword: string = '';
  public bPasswordNew: boolean = false;
  public bShowChangePassword: boolean = false;
  public bErrorRepeatPassword: boolean = false;

private loadUser: UserType;



  constructor(private is: GuideService,
              private fb: FormBuilder,
              private auth: AuthService,
              private router: Router,
              private gs: GuideService) {


    this.createForm();
    this.accountEmployeeForm = new FormGroup({
      'inputUserName': new FormControl({disabled: true},[]),
      'inputName': new FormControl('',[]),
      'inputLastName' : new FormControl('',[]),
      'inputZip' : new FormControl('',[]),
      'inputAddress' : new FormControl('',[]),
      'inputPhone' : new FormControl('',[]),
      'inputCity' : new FormControl('',[]),
      'inputNewPassword1' : new FormControl('',[]),
      'inputNewPassword2' : new FormControl('',[])
    });
  }


  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      avatar: ''
    });
  }


  clearFile() {
    this.form.get('avatar').setValue(null);
    this.form.get('name').setValue(null);
    this.base64textString = [];
  }


  ngOnInit() {

    this.base64textString = [];

    var Res =  this.auth.loginStorage();
    if (Res.bConnected) this.id_user = Res.id_user; else this.id_user = -1;

    this.subscrDataUserFromId = this.auth.getDataUserFromId(this.id_user).subscribe(value=> {

      this.loadCurrentUserInfo(value);
      this.loadUser = value as UserType;

      // вытаскиваем из базы картинку аватара
      let S = this.loadUser['Avatar'].Avatar;
      if (typeof S !== 'undefined') {
        if (S.length>0) {
          this.base64textString.push('data:image/png;base64,' + JSON.parse(S).value);
        }
      }
    });
  }


  onFileChange(event) {

    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {


      let file = event.target.files[0];

      reader.readAsDataURL(file);
      reader.onload = () => {
        var tempImg = new Image();
        tempImg.src = reader.result;
        tempImg.onload =() => {
          var dataURL = this.ResizeImage(tempImg);
          console.log('dataURL', dataURL);
          this.form.get('avatar').setValue({
//          filename: file.name,
//          filetype: file.type,
            value: dataURL.split(',')[1]
          });

          this.form.get('name').setValue(file.name);
          this.onPostImageAvatar();
        };
      };

    }
  }


  ResizeImage(tempImg: HTMLImageElement): string {
    var MAX_WIDTH = 400;
      var MAX_HEIGHT = 300;
      var tempW = tempImg.width;
      var tempH = tempImg.height;
      if (tempW > tempH) {
        if (tempW > MAX_WIDTH) {
          tempH *= MAX_WIDTH / tempW;
          tempW = MAX_WIDTH;
        }
      } else {
        if (tempH > MAX_HEIGHT) {
          tempW *= MAX_HEIGHT / tempH;
          tempH = MAX_HEIGHT;
        }
      }
      var canvas = document.createElement('canvas');
      canvas.width = tempW;
      canvas.height = tempH;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(tempImg, 0, 0, tempW, tempH);
      var dataURL = canvas.toDataURL("image/png");

      return dataURL;
  }



  ngOnDestroy() {
    if (typeof  this.subscrDataUserFromId !== 'undefined') {
      this.subscrDataUserFromId.unsubscribe();
    }
  }

  loadCurrentUserInfo(item: any) {
    // редактируемый список городов по подписке с выбранным ранее городом в качестве выбранного
    this.cveditCityTable = this.is.getCityTable().subscribe(
      (data: City[]) => {
        this.listCity = data;

        if (typeof item.City !== 'undefined') {

          if (item.City !== -1) {
            if (this.listCity.length > 0) this._myDisplayCity = this.listCity[item.City - 1].name;
          } else if (this.listCity.length > 0) this._myDisplayCity = this.listCity[0].name;
        } else {
          if (this.listCity.length > 0) this._myDisplayCity = this.listCity[0].name;
        }
        this.accountEmployeeForm.controls['inputCity'].setValue(this._myDisplayCity);

        if (typeof item.Zip !== 'undefined') {
          this.accountEmployeeForm.controls['inputZip'].setValue(item.Zip);
        }

        if (typeof item.UserName !== 'undefined') {
          this.accountEmployeeForm.controls['inputUserName'].setValue(item.UserName);
        }

        if (typeof item.Name !== 'undefined') {
          this.accountEmployeeForm.controls['inputName'].setValue(item.Name);
        }


        if (typeof item.LastName !== 'undefined') {
          this.accountEmployeeForm.controls['inputLastName'].setValue(item.LastName);
        }

        if (typeof item.Address !== 'undefined') {
          this.accountEmployeeForm.controls['inputAddress'].setValue(item.Address);
        }

        if (typeof item.Phone !== 'undefined') {
          this.accountEmployeeForm.controls['inputPhone'].setValue(item.Phone);
        }

        if (typeof item.EMail !== 'undefined') this._sEmail = item.EMail;
        if (typeof item.Password !== 'undefined') this._sPassword = item.Password;
      }
    );
  }


  savecv() {
    var id_city = -1;
    const {inputUserName, inputName, inputLastName, inputZip, inputAddress, inputPhone, inputCity} = this.accountEmployeeForm.value;
    this.gs.getCityId(inputCity).subscribe( (value: City) => {

      if (typeof value[0].id  !== 'undefined') {id_city = value[0].id;}
      const AddUser  = new UserType(inputUserName, this._sEmail, this._sPassword,
                                   false, id_city, inputZip, inputName, inputLastName, inputAddress, inputPhone);
      return this.auth.updateDataUserTable(AddUser, this.id_user).subscribe(
        () => {
          this.router.navigate(['/']); }
      );
    });
    }


    NewPassword() {

            const {inputNewPassword1, inputNewPassword2} = this.accountEmployeeForm.value;



            if (inputNewPassword1 === inputNewPassword2) this.bErrorRepeatPassword = false;
                                                    else this.bErrorRepeatPassword = true;

            if (inputNewPassword1 === inputNewPassword2) {
                this.loadUser.Password = inputNewPassword1;
                console.log('this.loadUser',this.loadUser);
                return this.auth.updateDataUserTable(this.loadUser, this.id_user).subscribe(
                    () => {
                      this.bPasswordNew = true; }
                );
            }

    }


  accessPassword() {
    this.bShowChangePassword = !this.bShowChangePassword;
  }

  back() {
    this.router.navigate(['/']);
  }


  onLoadFromBaseAvatar() {

    this.auth.getDataUserFromId(this.id_user).subscribe((aRes)=>
    {
      this.base64textString = [];
      const S = aRes['Avatar'].Avatar;
      if (typeof S !== 'undefined') {
        if (S.length>0) {
          this.base64textString.push('data:image/png;base64,' + JSON.parse(S).value);
        }
      }
    });

  }

  onPostImageAvatar() {

    const formModel = this.prepareSave();
    this.loading = true;
    this.auth.updateAvatarUserTable( {'Avatar': formModel.get('avatar'), 'Name': formModel.get('name') }, this.id_user).subscribe(()=> {
      this.loading = false;
      this.onLoadFromBaseAvatar();
    });

  }

  private prepareSave(): FormData {
    let input: FormData = new FormData();
    // This can be done a lot prettier; for example automatically assigning values by looping through `this.form.controls`, but we'll keep it as simple as possible here
    //input.
    input.append('name', this.form.get('name').value);
    input.append('avatar', JSON.stringify(this.form.get('avatar').value));
    return input;
  }


}
