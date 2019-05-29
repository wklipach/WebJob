import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Letter} from '../class/Letter';
import {GlobalRef} from './globalref';
import set = Reflect.set;

@Injectable({
  providedIn: 'root'
})
export class CvListService {

  constructor(private http: HttpClient, private gr: GlobalRef) { }

  // получение списка резюме данного юзера, котопрые пока не удалены
  getCvList(id_user: number) {

    const sUrl =  this.gr.sUrlGlobal+'CV';

    let params = new HttpParams()
      .set('id_user', id_user.toString())
      .set('bInvisible', 'false')

    return this.http.get(sUrl, {params: params});
  }


  setUpdateDateCv(id: number) {
    const sUrl =  this.gr.sUrlGlobal+'CV';
    let cv: any = { UpdateDate: true, id: id.toString()};
    return this.http.post(sUrl, {cv});
  }

  setDeleteCv(id_cv: number, cv) {
    const sUrl = this.gr.sUrlGlobal+'CV';
    cv['DeleteCV'] = 'true';
    console.log('cv=',cv);
    return this.http.post(sUrl, {cv});
  }

  setDeleteSecondaryCv(id_cv: number) {

    const sUrl = this.gr.sUrlGlobal+'CV';

    let params = new HttpParams()
      .set('id_cv', id_cv.toString())
      .set('DeleteSecondary', 'true')

    return this.http.get(sUrl, {params: params});

  }


  setCorrespondence(letter: Letter) {
    const sUrl = this.gr.sUrlGlobal+'Correspondence';

    console.log('letter', letter);

    return this.http.post(sUrl, {letter});
  }



}
