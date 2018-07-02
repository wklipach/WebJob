import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserTable} from '../class/UserTable';
import {UserType} from '../class/UserType';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {

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
