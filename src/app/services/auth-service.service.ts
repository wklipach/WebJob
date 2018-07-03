import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserTable} from '../class/UserTable';
import {UserType} from '../class/UserType';
import {Subject} from 'rxjs';

@Injectable()
export class AuthService {


  public IsUserLoggedIn: Subject<{connect: boolean, name : string}> = new Subject<{connect: boolean, name : string}>();

  private isAuthenticated = false;
  private sUserName : string = '';




  constructor(private http: HttpClient) {

  }

  login(sUserName: string) {
    this.isAuthenticated = true;
    this.sUserName = sUserName;
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
    return this.sUserName;
  }


  getDataUserTable(UserName: string)
  {
    //вставить запрос типа select top 10 * from UserTable where UserName=:@UserName
    return this.http.get('http://localhost:3000/UserTable');
  }

  getDataUserOrEmailTable(sUserOrEmail: string)
  {
    //вставить запрос типа select top 10 * from UserTable where UserName=:@UserOrEmail or UserName=:@UserOrEmail
    return this.http.get('http://localhost:3000/UserTable');
  }



  postDataUserTable(user: UserType){
    //вставить запрос по добавлению пользователя в базу
    return this.http.post('http://localhost:3000/UserTable',user);
  }

}
