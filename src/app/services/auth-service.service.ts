import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {UserType} from '../class/UserType';
import {Observable, Subject} from 'rxjs';
import {GlobalRef} from './globalref';
import {City} from '../class/City';

@Injectable()
export class AuthService {


  public IsUserLoggedIn: Subject<{connect: boolean, name : string, id_user: number, bEmployer: boolean}> = new Subject<{connect: boolean, name : string, id_user: number, bEmployer: boolean}>();
  public OnSwitchVacancy: Subject<{boolVacancy: boolean}> = new Subject<{boolVacancy: boolean}>();

  private isAuthenticated = false;
  private _sUserName : string = '';
  private _id_user: number;
  private _bEmployer: boolean;



  constructor(private http: HttpClient, private gr: GlobalRef) {

  }


  loadCurrentLangCity(s1, s2, s3 : string): string {
    let curL = this.getLangStorage();
    if (typeof curL === 'undefined') {
      curL = 0;
    }

    let s = s1;
    if (curL === 0) s = s1;
    if (curL === 1) s = s2;
    if (curL === 2) s = s3;

    return s;
  }


  loadLangCity(data: City[]): City[]  {
    let curL = this.getLangStorage();
    if (typeof curL === 'undefined') {
      curL = 0;
    }
    data.forEach((eekey, ih) => {
      if (curL === 1) eekey.name = eekey.nameEx1;
      if (curL === 2) eekey.name = eekey.nameEx2;
    });

    return data;

  }




  login(sUserName: string, id_user: number, bEmployer: boolean) {
    this.isAuthenticated = true;
    this._sUserName = sUserName;
    this._id_user = id_user;
    this._bEmployer = bEmployer;

    //console.log('login=',this._id_user,this._sUserName,this.isAuthenticated);

  }

  logout() {

    //вытираем все, но сохраняем idLang

    this.isAuthenticated = false;

    let idLang = -1;
    if (window.localStorage.getItem('LangStorage') !== null) {
      idLang = parseInt(JSON.parse(window.localStorage.getItem('LangStorage')));
    }

    let curCV= "-1";
    if (window.localStorage.getItem('CV') !== null) {
      curCV = JSON.parse(window.localStorage.getItem('CV'));
    }

    window.localStorage.clear();

    if (curCV !== "-1") {
      window.localStorage.setItem('CV', curCV);
    }


    if (idLang !== -1) {
      window.localStorage.setItem('LangStorage', idLang.toString());
    }

  }

  isLoggedIn(): boolean

  {
    return this.isAuthenticated;
  }

  getUserNameIn(): string {
    return this._sUserName;
  }

  getId_User(): number {
    return this._id_user;
  }


  // получаем список соискателей
  getOnlyUser(UserName: string)  {
    // вставить запрос типа select top 10 * from UserTable where UserName=:@UserName
    return this.http.get(this.gr.sUrlGlobal+'UserTable?bEmployer=false');
  }

  //получаем список работодателей
  getOnlyEmployer(UserName: string)  {
    // вставить запрос типа select top 10 * from UserTable where UserName=:@UserName
    return this.http.get(this.gr.sUrlGlobal+'UserTable?bEmployer=true');
  }



  getDataUserTable(UserName: string) {
    // вставить запрос типа select top 10 * from UserTable where UserName=:@UserName
    return this.http.get(this.gr.sUrlGlobal+'UserTable');
    // http://localhost:3000/UserTable?bEmployer=false
 }


  getDataUserTableWithoutCurrentUser(UserName: string) {
    let sUrl = this.gr.sUrlGlobal+'UserTable';
    //console.log('sUrl, UserName =', sUrl,UserName);
    let params = new HttpParams()
      .set('UserName', UserName);
    return this.http.get(sUrl, {params: params});

  }


  getDataUserOrEmailTable(sUserOrEmail: string)
  {
    // вставить запрос типа select top 10 * from UserTable where UserName=:@UserOrEmail or UserName=:@UserOrEmail
    return this.http.get(this.gr.sUrlGlobal+'UserTable');
  }

  getDataUserFromId(id_user: number) {

    //console.log('ОПТИМИЗАЦИЯ: ТУТ ГРУЗИМ КАРТИНКУ');
    //
    const S = this.gr.sUrlGlobal+'UserTable/'+id_user.toString();
    return this.http.get(S);
   }


  postDataUserTable(user: UserType){
    // вставить запрос по добавлению пользователя в базу

    //TODO ТУТ ПРАВИМ!!!!!
    let nUser: any = user;
    nUser.NewUser = 'new_user';
    return this.http.post(this.gr.sUrlGlobal+'UserTable', nUser);
  }


  postUpdatePassword(NewPassword: string, id_user: number){
    // вставить запрос по добавлению пользователя в базу
    let ut = { NPassword : 'new_password', NewPassword: NewPassword, id_user: id_user};
    return this.http.post(this.gr.sUrlGlobal+'UserTable', ut);
  }

  updateDataUserTable(user: UserType, id_user: number){
    //запрос изменения пользователя в базу
    let nUser: any = user;
    return this.http.post(this.gr.sUrlGlobal+'UserTable/'+id_user, nUser);
  }


  getNewAvatar(sFileName: string) {

  let sUrl = this.gr.sUrlGlobal+'UserTable';

  let params = new HttpParams()
    .set('Avatar', 'Avatar')
    .set('NameAvatar', sFileName);

  return this.http.get(sUrl, {params: params});

 }

  updateAvatarUserTable(curAvatar: any, id_user: number){

    //console.log('curAvatar', this.gr.sUrlGlobal+'UserTable/'+id_user+'/avatar');

    return this.http.post(this.gr.sUrlGlobal+'UserTable/'+id_user+'/avatar', {"Avatar": curAvatar});
  }


  public uploadImageAvatar(image: File): Observable<Object> {
    const formData = new FormData();
    formData.append('myFile', image, image.name);
    //console.log('formData',formData.get('myFile') );
    return this.http.post(this.gr.sUrlGlobal+'file-upload', formData);
  }

///

  public getLangStorage(): number {

    let idLang: number = 1;
    if (window.localStorage.getItem('LangStorage') !== null) {
      idLang = parseInt(JSON.parse(window.localStorage.getItem('LangStorage')));
    }

    return idLang;
  }

  public setLangStorage(idLang: number) {
         window.localStorage.setItem('LangStorage', idLang.toString());
  }


  public setForFavorites(bFV: boolean) {
    window.localStorage.setItem('FV', bFV.toString());
  }

  public getForFavorites(): boolean {
    if (window.localStorage.getItem('FV') === null) return false; else {
      if (window.localStorage.getItem('FV') === "false") return false; else return true;
    }
  }



  public setVorCV(bCV: boolean) {
    window.localStorage.setItem('CV', bCV.toString());
  }

  public getVorCV(): boolean {

    if (window.localStorage.getItem('CV') === null) return false; else {
      if (window.localStorage.getItem('CV') === "false") return false; else return true;
    }

  }



  public loginStorage(): {htUserName: string; bConnected: boolean; id_user: number; bEmployer: boolean} {

  let htUserName = '';
  if (window.localStorage.getItem('htUserName') !== '') {
    htUserName = JSON.parse(window.localStorage.getItem('htUserName'));
  }

  let bConnected = false;
  if (window.localStorage.getItem('bConnected') !== '') {
    bConnected = JSON.parse(window.localStorage.getItem('bConnected'));
  }

  let id_user = -1;
  if (window.localStorage.getItem('id_user') !== '') {
    id_user = JSON.parse(window.localStorage.getItem('id_user'));
  }

   let bEmployer = false;
   if (window.localStorage.getItem('bEmployer') !== '') {
     bEmployer = JSON.parse(window.localStorage.getItem('bEmployer'));
   }

  return {htUserName: htUserName,bConnected: bConnected, id_user: id_user, bEmployer: bEmployer};
}

////

}
