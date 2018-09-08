import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserType} from '../class/UserType';
import {Subject} from 'rxjs';

@Injectable()
export class AuthService {


  public IsUserLoggedIn: Subject<{connect: boolean, name : string, id_user: number}> = new Subject<{connect: boolean, name : string, id_user: number}>();

  private isAuthenticated = false;
  private _sUserName : string = '';
  private _id_user: number;



  constructor(private http: HttpClient) {

  }

  login(sUserName: string, id_user: number) {
    this.isAuthenticated = true;
    this._sUserName = sUserName;
    this._id_user = id_user;

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



  getDataUserTable(UserName: string)
  {
    // вставить запрос типа select top 10 * from UserTable where UserName=:@UserName
    return this.http.get('http://localhost:3000/UserTable');
  }

  getDataUserOrEmailTable(sUserOrEmail: string)
  {
    // вставить запрос типа select top 10 * from UserTable where UserName=:@UserOrEmail or UserName=:@UserOrEmail
    return this.http.get('http://localhost:3000/UserTable');
  }



  postDataUserTable(user: UserType){
    // вставить запрос по добавлению пользователя в базу
    return this.http.post('http://localhost:3000/UserTable',user);
  }


///

 public loginStorage(): {htUserName: string; bConnected: boolean; id_user: number} {

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

  return {htUserName: htUserName,bConnected: bConnected, id_user: id_user};
}

////

}
