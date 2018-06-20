import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {

  }

  getDataUserTable() {
    return this.http.get('http://localhost:3000/UserTable');
  }

}
