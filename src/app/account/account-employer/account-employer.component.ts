import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {City} from '../../class/City';
import {GuideService} from '../../services/guide-service.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth-service.service';
import {UserType} from '../../class/UserType';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {UserTable} from '../../class/UserTable';
import {isUndefined} from "util";
import {Guide} from '../../class/guide';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-accountemployer',

  templateUrl: './account-employer.component.html',
  styleUrls: ['./account-employer.component.css']

})
export class AccountEmployerComponent implements OnInit {

  base64textString = [];
  genderList: Guide[];
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
  public bErrorEmptyPassword: boolean = false;

  public imagePath: any;
  form: FormGroup;
  loading: boolean = false;
  @ViewChild('fileInput') fileInput: ElementRef;

  src:string;
  @ViewChild('imgRef') img:ElementRef;


    loadIdUser() {
      var Res = this.auth.loginStorage();
      if (Res.bConnected) {
        this.id_user = Res.id_user;
      } else {
        this.id_user = -1;
      }
    }


constructor(  private is: GuideService,
              private auth: AuthService,
              private router: Router,
              private gs: GuideService,
              private fb: FormBuilder,
              private _sanitizer: DomSanitizer) {


    this.loadIdUser();
    this.createForm();
  }

  getCheckEmail (ListUser: UserTable, sEmail: string): boolean
  {
    var ResUser = Object(ListUser).find( x => x.EMail.toLowerCase() === sEmail.trim().toLowerCase());
    if (isUndefined(ResUser)) {return false;} else {return true;}
  }

  // валидатор по EMail
  userEmailAsyncValidator(control: FormControl): Promise<{[s:string]: boolean}> {
    return new Promise(
      (resolve, reject)=>{

        console.log('userEmailAsyncValidator',this.loadUser[0].UserName);
        return this.auth.getDataUserTableWithoutCurrentUser(this.loadUser[0].UserName).subscribe(
          (data: UserTable) => {
            if (this.getCheckEmail (data,control.value) === true) {
              resolve( {'errorEmailExists': true});
            }
            else {
              resolve(null);
            }
          }
        );
      }
    );
  }


  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      avatar: ''
    });
  }

  ngOnInit() {

    this.createAccountEmployerForm();

    this.subscrDataUserFromId =
      this.auth.getDataUserFromId(this.id_user).subscribe(value =>
       {
         this.loadCurrentUserInfo(value[0]);
         this.loadUser = value as UserType;
         // вытаскиваем из базы картинку аватара
         console.log('this.loadUser', this.loadUser);

         let S = this.loadUser[0].Avatar;

         if (S===null) {S = '';}

         if (S.toString().length>0) {
           this.base64textString.push('data:image/png;base64,' + JSON.parse(S).value);
         }
        }
      );
    }


createAccountEmployerForm() {
  this.accountEmployerForm = new FormGroup({

    'inputUserName': new FormControl({value: ''}, []),
    'inputName': new FormControl(),
    'inputLastName': new FormControl(),
    'inputZip': new FormControl(),
    'inputAddress': new FormControl(),
    'inputPhone': new FormControl(),
    'inputCity': new FormControl(),
    'inputNewPassword1': new FormControl('', []),
    'inputNewPassword2': new FormControl('', [], [this.password2AsyncValidator.bind(this)]
    ),
    'inputEmail': new FormControl(null, [
      Validators.required,
      Validators.email
    ], [this.userEmailAsyncValidator.bind(this)]
    ),
    'inputGender': new FormControl('', []),
    'inputBirth': new FormControl('', []),

    'inputPhone2': new FormControl(),
    'inputWeb': new FormControl(),
    'inputAbout': new FormControl(),
    'inputContactPerson': new FormControl()
  });

  this.genderList = this.gs.getGenderList();

   this.accountEmployerForm.controls['inputUserName'].disable();
}


  ngOnDestroy() {

    if (typeof  this.subscrDataUserFromId !== 'undefined') {
      this.subscrDataUserFromId.unsubscribe();
    }
  }

  loadCurrentUserInfo(item: any) {


console.log('ITEM', item);
    console.log('ITEMUserName', item.UserName);

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
        if (typeof item.EMail !== 'undefined') {
          this._sEmail = item.EMail;
          this.accountEmployerForm.controls['inputEmail'].setValue(item.EMail);
        }
        if (typeof item.Password !== 'undefined') this._sPassword =item.Password;

        if (typeof item.Gender !== 'undefined') {
          this.accountEmployerForm.controls['inputGender'].setValue(this.genderList.find((value) => value.id == item.Gender).name);
        }

        if (typeof item.DateBirth !== 'undefined') {
          let birthDate = new Date(item.DateBirth);
          this.accountEmployerForm.controls['inputBirth'].setValue(birthDate.toISOString().substring(0,10));
        }

        if (typeof item.Phone2 !== 'undefined') {
          this.accountEmployerForm.controls['inputPhone2'].setValue(item.Phone2);
        }

        if (typeof item.Web !== 'undefined') {
          this.accountEmployerForm.controls['inputWeb'].setValue(item.Web);
        }

        if (typeof item.About !== 'undefined') {
          this.accountEmployerForm.controls['inputAbout'].setValue(item.About);
        }

        if (typeof item.ContactPerson !== 'undefined') {
          this.accountEmployerForm.controls['inputContactPerson'].setValue(item.ContactPerson);
        }
      }
    );
  }


  // валидатор по паролю
  password2AsyncValidator(control: FormControl): Promise<{[s:string]: boolean}> {
    return new Promise(
      (resolve, reject)=>{
        if (this.accountEmployerForm.controls['inputNewPassword1'].value !== control.value) {
          resolve( {'myError': true});
        }
        else {
          resolve(null);
        }
      }
    );
  }


  savecv() {

    console.log('R1');

    if (this.accountEmployerForm.invalid) {
      return -1;
    }

    var id_city = -1;

    let {inputUserName, inputName, inputLastName, inputZip, inputAddress,
      inputPhone, inputCity, inputEmail, inputGender, inputBirth,
      inputContactPerson, inputAbout, inputWeb, inputPhone2} = this.accountEmployerForm.value;

    inputUserName = this.accountEmployerForm.controls['inputUserName'].value;

    console.log('inputUserName', inputUserName);


/*
    console.log('inputName', inputName);
    console.log('inputLastName', inputLastName);
    console.log('inputZip', inputZip);
    console.log('inputAddress', inputAddress);
    console.log('inputPhone', inputPhone);
    console.log('inputCity', inputCity);
    console.log('inputEmail', inputEmail);
    console.log('inputGender', inputGender);
    console.log('inputBirth', inputBirth);

    console.log('inputContactPerson',inputContactPerson);
    console.log('inputAbout', inputAbout);
    console.log('inputWeb', inputWeb);
    console.log('inputPhone2', inputPhone2);
*/

    this.gs.getCityId(inputCity).subscribe( (value: City) => {

      if (typeof value[0].id  !== 'undefined') {id_city = value[0].id;}

      const AddUser  = new UserType(inputUserName, inputEmail,
        this._sPassword,
        true, id_city, inputZip, inputName, inputLastName, inputAddress,
        inputPhone, this.genderList.find((value)=>value.name == inputGender).id,
        Date.parse(inputBirth),
        inputContactPerson,
        inputAbout,
        inputWeb,
        inputPhone2
    );


      return this.auth.updateDataUserTable(AddUser, this.id_user).subscribe(

        () => {

          this.router.navigate(['/']); }

      );

    });
  }

  NewPassword() {
    const {inputNewPassword1: inputNewPassword1, inputNewPassword2: inputNewPassword2} = this.accountEmployerForm.value;

    this.bErrorEmptyPassword = false;
    this.bErrorRepeatPassword = false;

    if (inputNewPassword1.length==0 || inputNewPassword2.length==0) {
      this.bErrorEmptyPassword = true;
      return;
    }
    else this.bErrorEmptyPassword = false;



    if (inputNewPassword1 === inputNewPassword2) this.bErrorRepeatPassword = false;
    else this.bErrorRepeatPassword = true;

    if (inputNewPassword1 === inputNewPassword2) {
      this.loadUser.Password = inputNewPassword1;


      return this.auth.postUpdatePassword(CryptoJS.SHA256(inputNewPassword2.trim().toLowerCase()).toString().toLowerCase(),
                                                                                                          this.id_user).subscribe(
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


  onFileChange(event) {

    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {


      let file = event.target.files[0];

      reader.readAsDataURL(file);
      reader.onloadend = () => {
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


  clearFile() {
    this.form.get('avatar').setValue(null);
    this.form.get('name').setValue(null);
    this.fileInput.nativeElement.value = '';
    this.base64textString = [];
    this.onPostImageAvatar();
  }

  private prepareSave(): FormData {
    let input: FormData = new FormData();
    // This can be done a lot prettier; for example automatically assigning values by looping through `this.form.controls`, but we'll keep it as simple as possible here
    //input.
    input.append('name', this.form.get('name').value);
    input.append('avatar', JSON.stringify(this.form.get('avatar').value));
    return input;
  }


  onLoadFromBaseAvatar() {

    this.auth.getDataUserFromId(this.id_user).subscribe((aRes)=>
    {

      console.log('aRes', aRes);

      const S = aRes[0].Avatar;
      this.base64textString = [];
      if (S !== '""') {
        if (typeof S !== 'undefined') {
          if (S.length > 0) {
            if (JSON.parse(S) !== null) {
              this.base64textString.push('data:image/png;base64,' + JSON.parse(S).value);
            }
          }
        }
      }
    });
  }

  DisappearFrame() {

    this.accountEmployerForm.controls['inputNewPassword1'].setValue('');
    this.accountEmployerForm.controls['inputNewPassword2'].setValue('');
    this.bShowChangePassword = false;
  }


  onPostImageAvatar() {

    const formModel = this.prepareSave();
    this.loading = true;
     this.auth.updateAvatarUserTable( {'Avatar': formModel.get('avatar'), 'Name': formModel.get('name') }, this.id_user).subscribe(()=> {
       this.loading = false;
       this.onLoadFromBaseAvatar();
       });

  }


  ResizeImage(tempImg: HTMLImageElement): string {
    var MAX_WIDTH = 400;
    var MAX_HEIGHT = 123;
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





}
