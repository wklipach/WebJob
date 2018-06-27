import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {

  }

  getDataUserTable(UserName: string)
  {
    //вставить запрос типа select top 10 * from UserTable where UserName=:@UserName
    return this.http.get('http://localhost:3000/UserTable');
  }

}
