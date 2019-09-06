import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {GlobalRef} from './globalref';

@Injectable({
  providedIn: 'root'
})
export class CheckpostService {

  constructor(private http: HttpClient, private gr: GlobalRef) { }

  getCheckPostCv() {
    let sUrl = this.gr.sUrlGlobal+'checkpost';
    let params = new HttpParams()
      .set('UnModerCv', 'UnModerCv');
    return this.http.get(sUrl, {params: params});
  }

  getCheckPostVc() {
    let sUrl = this.gr.sUrlGlobal+'checkpost';
    //console.log('sUrl, UserName =', sUrl,UserName);
    let params = new HttpParams()
      .set('UnModerVc', 'UnModerVc');
    return this.http.get(sUrl, {params: params});
  }


  setDeleteVc(id_vc: number) {
    let sUrl = this.gr.sUrlGlobal+'checkpost';
    return this.http.post(sUrl, {deleteVC: id_vc});
  }

  setDeleteCv(id_cv: number) {
    let sUrl = this.gr.sUrlGlobal+'checkpost';
    return this.http.post(sUrl, {deleteCV: id_cv});
  }


  setApplyAllVc() {
    let sUrl = this.gr.sUrlGlobal+'checkpost';
    return this.http.post(sUrl, {applyAllVc: 'applyAllVc'});
  }


  setApplyAllCv() {
    let sUrl = this.gr.sUrlGlobal+'checkpost';
    return this.http.post(sUrl, {applyAllCv: 'applyAllCv'});
  }

  setDeleteAll(id_user_action: number, id_user_delete: number) {
    let sUrl = this.gr.sUrlGlobal+'checkpost';
    return this.http.post(sUrl, {deleteAll: 'deleteAll',id_user_action: id_user_action, id_user_delete: id_user_delete});
  }



}
