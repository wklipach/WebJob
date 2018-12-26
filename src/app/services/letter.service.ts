import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable, of} from 'rxjs';
import {Letter} from '../class/Letter';

@Injectable({
  providedIn: 'root'
})
export class LetterService {

  private _letter: Letter;

  constructor(private http: HttpClient) { }

  // получение корреспонденции данного юзера
  getListLetter(id_user: number)
  {
    // let sUrl = 'http://localhost:3000/Correspondence?letter.id_user_to='+id_user;

    let sUrlTo ='http://localhost:3000/Correspondence?letter.id_user_to='+id_user;
    let sUrlFrom ='http://localhost:3000/Correspondence?letter.id_user_from='+id_user;

    let charUrlFrom = this.http.get(sUrlFrom);
    let charUrlTo = this.http.get(sUrlTo);


    return forkJoin([charUrlFrom, charUrlTo]);



//    return this.http.get(sUrl);
  }

  //помечаем письмо как прочитанное
  public setLetter(oLetter: Letter) {
    this._letter = oLetter;
    let postObj: any = this._letter;
    postObj.letter.bOld = true;
    let sUrl = 'http://localhost:3000/Correspondence/'+this._letter.id;
    return this.http.patch(sUrl, postObj);
  }


  public getLetter(): Observable<Letter> {
     return of (this._letter);
  }

  // получение ФИО данного юзера От кого и кому (два объекта на выходе)
  getUserName(id_user_from: number, id_user_to: number)
  {

    let sUrl = 'http://localhost:3000/UserTable?id='+id_user_from+'&id='+id_user_to;
    return this.http.get(sUrl);
  }


  // получение одного письма по номеру
  getAnyLetter(id_letter: number)
  {
    let sUrl ='http://localhost:3000/Correspondence?id='+id_letter;
    return this.http.get(sUrl);
  }



}
