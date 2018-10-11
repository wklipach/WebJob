import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserType} from '../class/UserType';
import {Subject} from 'rxjs';

@Injectable()
export class AuthService {


  public IsUserLoggedIn: Subject<{connect: boolean, name : string, id_user: number, bEmployer: boolean}> = new Subject<{connect: boolean, name : string, id_user: number, bEmployer: boolean}>();

  private isAuthenticated = false;
  private _sUserName : string = '';
  private _id_user: number;
  private _bEmployer: boolean;



  constructor(private http: HttpClient) {

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
    return this.http.get('http://localhost:3000/UserTable?bEmployer=false');
  }

  //получаем список работодателей
  getOnlyEmployer(UserName: string)  {
    // вставить запрос типа select top 10 * from UserTable where UserName=:@UserName
    return this.http.get('http://localhost:3000/UserTable?bEmployer=true');
  }



  getDataUserTable(UserName: string) {
    // вставить запрос типа select top 10 * from UserTable where UserName=:@UserName
    return this.http.get('http://localhost:3000/UserTable');

    // http://localhost:3000/UserTable?bEmployer=false


  }

  getDataUserOrEmailTable(sUserOrEmail: string)
  {
    // вставить запрос типа select top 10 * from UserTable where UserName=:@UserOrEmail or UserName=:@UserOrEmail
    return this.http.get('http://localhost:3000/UserTable');
  }

  getDataUserFromId(id_user: number) {
    return this.http.get('http://localhost:3000/UserTable/'+id_user);
      }


  postDataUserTable(user: UserType){
    // вставить запрос по добавлению пользователя в базу
    return this.http.post('http://localhost:3000/UserTable',user);
  }


  //  Запрос типа PATCH
  //  Для того чтобы обновить уже существующую запись необходимо отправить PATCH запрос с указанием новых значений для уже существующей записи.
  //  К примеру, чтобы обновить пользователя с Id 2, отправьте PATCH запрос по адресу http://localhost:3000/UserTable/2:
  updateDataUserTable(user: UserType, id_user: number){
    // вставить запрос по добавлению пользователя в базу

    return this.http.patch('http://localhost:3000/UserTable/'+id_user, user);
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
