import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {UserType} from '../class/UserType';
import {Subject} from 'rxjs';
import {GlobalRef} from './globalref';
import {RequestOptions} from '@angular/http';

@Injectable()
export class AuthService {


  public IsUserLoggedIn: Subject<{connect: boolean, name : string, id_user: number, bEmployer: boolean}> = new Subject<{connect: boolean, name : string, id_user: number, bEmployer: boolean}>();

  private isAuthenticated = false;
  private _sUserName : string = '';
  private _id_user: number;
  private _bEmployer: boolean;



  constructor(private http: HttpClient, private gr: GlobalRef) {

  }

  login(sUserName: string, id_user: number, bEmployer: boolean) {
    this.isAuthenticated = true;
    this._sUserName = sUserName;
    this._id_user = id_user;
    this._bEmployer = bEmployer;

    console.log('login=',this._id_user,this._sUserName,this.isAuthenticated);

  }

  logout() {
    this.isAuthenticated = false;
    window.localStorage.clear();
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
    console.log('sUrl, UserName =', sUrl,UserName);
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

    console.log('ОПТИМИЗАЦИЯ: ТУТ ГРУЗИМ КАРТИНКУ');
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


  updateDataUserTable(user: UserType, id_user: number){
    //запрос изменения пользователя в базу
    let nUser: any = user;
    return this.http.post(this.gr.sUrlGlobal+'UserTable/'+id_user, nUser);
  }


  updateAvatarUserTable(curAvatar: any, id_user: number){

    console.log('curAvatar', this.gr.sUrlGlobal+'UserTable/'+id_user+'/avatar');

    return this.http.post(this.gr.sUrlGlobal+'UserTable/'+id_user+'/avatar', {"Avatar": curAvatar});
  }


///

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
