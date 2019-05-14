import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {forkJoin, Observable, of} from 'rxjs';
import {Letter} from '../class/Letter';
import {GlobalRef} from './globalref';

@Injectable({
  providedIn: 'root'
})
export class LetterService {

  private _letter: Letter;

  constructor(private http: HttpClient, private gr: GlobalRef) { }


  // получение корреспонденции для данного юзера от Adnmin
  getListInfo(id_user: number) {

    let sUrl = this.gr.sUrlGlobal+'Correspondence';
    let params = new HttpParams()
      .set('Info', 'true')
      .set('id_user_to', id_user.toString())
      .set('id_user_from', '1')

    return this.http.get(sUrl, {params: params});

  }



  // получение корреспонденции данного юзера
  getListLetter(id_user: number) {

    let sUrl = this.gr.sUrlGlobal+'Correspondence';
    let params = new HttpParams()
      .set('id_user_to', id_user.toString())
      .set('id_user_from', id_user.toString())

    return this.http.get(sUrl, {params: params});

  }


  // помечаем письмо как прочитанное в БД MySql
  public setOldLetter(lid: number) {
    const sUrl = this.gr.sUrlGlobal+'Correspondence';
    let postObj: any = new Object();
    postObj.bOld = true;
    postObj['bOldLetterTrue'] = 'true';
    postObj['id_letter'] = lid;
    return this.http.post(sUrl, postObj);
  }


  // помечаем письмо как прочитанное
  public setLetter(oLetter: Letter) {

    const sUrl = this.gr.sUrlGlobal+'Correspondence';

    this._letter = oLetter;

    let postObj: any = this._letter;
    postObj.bOld = true;
    postObj['bOldLetterTrue'] = 'true';
    postObj['id_letter'] = this._letter.id;

    return this.http.post(sUrl, postObj);
  }


  public getLetter(): Observable<Letter> {
     return of (this._letter);
  }

  // получение ФИО данного юзера От кого и кому (два объекта на выходе)
  getUserName(id_user_from: number, id_user_to: number) {
    const sUrl = this.gr.sUrlGlobal+'UserTable';

    let params = new HttpParams()
      .set('UserNameFromTo', 'true')
      .set('id_user_from', id_user_from.toString())
      .set('id_user_to', id_user_to.toString())


    return this.http.get(sUrl, {params: params});



  }




  // получение самого первого в общении письма по случайному письму
  getFirstLetter(id_cv: number, id_vc: number) {
    const sUrl = this.gr.sUrlGlobal+'Correspondence';
    let params = new HttpParams()
      .set('firstletter', 'true')
      .set('id_cv', id_cv.toString())
      .set('id_vc', id_vc.toString())


// req.query['id_cv'], req.query['id_vc']
    console.log('sUrl',sUrl);
    return this.http.get(sUrl,{params: params});
  }



  // получение одного письма по номеру
  getAnyLetter(id_letter: number) {
    const sUrl = this.gr.sUrlGlobal+'Correspondence';
    let params = new HttpParams()
      .set('anyletter', 'true')
      .set('id', id_letter.toString())
    console.log('sUrl',sUrl);
    return this.http.get(sUrl,{params: params});
  }


  // получение списка писем
  getThreadLetter(id_cv, id_vc: number) {

    let params = new HttpParams()
      .set('listletter', 'true')
      .set('id_cv', id_cv.toString())
      .set('id_vc', id_vc.toString())

    const sUrl = this.gr.sUrlGlobal+'Correspondence';
    return this.http.get(sUrl, {params: params});
  }

  // получение вакансии
  getAnyVC(id_vc: number) {
    const sUrl = this.gr.sUrlGlobal+'Vacancy';
    let params = new HttpParams()
      .set('id_vc', id_vc.toString())
    return this.http.get(sUrl, {params: params});
  }

  getCountNotReadLetter(id_user: number){
  let sUrl = this.gr.sUrlGlobal+'Correspondence';
    let params = new HttpParams()
      .set('newletter', 'true')
      .set('id', id_user.toString())
   return this.http.get(sUrl, {params: params});

  }

  getCountNotReadBell(id_user: number){
    let sUrl = this.gr.sUrlGlobal+'Correspondence';
    let params = new HttpParams()
      .set('newbell', id_user.toString())
    return this.http.get(sUrl, {params: params});

  }

}
