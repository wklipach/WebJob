import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LetterService {

  constructor(private http: HttpClient) { }

  // получение корреспонденции данного юзера
  getListLetter(id_user: number)
  {
    let sUrl = 'http://localhost:3000/Correspondence?letter.id_user_to='+id_user;

    return this.http.get(sUrl);
  }


}
