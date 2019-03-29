import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {forkJoin, Observable, of} from 'rxjs';
import {Letter} from '../class/Letter';

@Injectable({
  providedIn: 'root'
})
export class LetterService {

  private _letter: Letter;

  constructor(private http: HttpClient) { }

  // получение корреспонденции данного юзера
  getListLetter(id_user: number) {

    let sUrl = 'http://localhost:3000/Correspondence';
    let params = new HttpParams()
      .set('id_user_to', id_user.toString())
      .set('id_user_from', id_user.toString())

    return this.http.get(sUrl, {params: params});

  }

  // помечаем письмо как прочитанное
  public setLetter(oLetter: Letter) {
    this._letter = oLetter;
    const postObj: any = this._letter;
    postObj.letter.bOld = true;
    const sUrl = 'http://localhost:3000/Correspondence/' + this._letter.id;
    return this.http.patch(sUrl, postObj);
  }


  public getLetter(): Observable<Letter> {
     return of (this._letter);
  }

  // получение ФИО данного юзера От кого и кому (два объекта на выходе)
  getUserName(id_user_from: number, id_user_to: number) {
    const sUrl = 'http://localhost:3000/UserTable?id=' + id_user_from + '&id=' + id_user_to;
    return this.http.get(sUrl);
  }


  // получение одного письма по номеру
  getAnyLetter(id_letter: number) {
    const sUrl = 'http://localhost:3000/Correspondence?id=' + id_letter;
    return this.http.get(sUrl);
  }


  // получение списка писем
  getThreadLetter(id_cv, id_vc: number) {
    const sUrl = 'http://localhost:3000/Correspondence?letter.id_cv=' + id_cv + '&letter.id_vc=' + id_vc;
    return this.http.get(sUrl);
  }

  // получение вакансии
  getAnyVC(id_vc: number) {
    const sUrl = 'http://localhost:3000/Vacancy?id=' + id_vc;
    return this.http.get(sUrl);
  }

  getCountNotReadLetter(id_user: number){
  let sUrl = 'http://localhost:3000/Correspondence';
    let params = new HttpParams()
      .set('newletter', id_user.toString())
   return this.http.get(sUrl, {params: params});

  }

  getCountNotReadBell(id_user: number){
    let sUrl = 'http://localhost:3000/Correspondence';
    let params = new HttpParams()
      .set('newbell', id_user.toString())
    return this.http.get(sUrl, {params: params});

  }

}
