import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {GlobalRef} from './globalref';

@Injectable({
  providedIn: 'root'
})
export class CvEditService {

  private _cvid: number = -1;
  private _cvitem: any;


  constructor(private http: HttpClient, private gr: GlobalRef) { }


  public  getAnyCv(id_cv: number) {

    let sUrl = this.gr.sUrlGlobal+'cv';
    let params = new HttpParams()
      .set('anycv', 'true')
      .set('id', id_cv.toString())

    //console.log('params',params);

    return this.http.get(sUrl, {params: params} );
  }






public  setCvId(cv_id: number) {
    window.localStorage.setItem('_cvid', JSON.stringify(cv_id));
    this._cvid = cv_id;
  }

  public  getCvId(): number {
    if (window.localStorage.getItem('_cvid') !== '' && window.localStorage.getItem('_cvid') !== undefined) {
      return this._cvid = JSON.parse(window.localStorage.getItem('_cvid'));
    } else
    return this._cvid;
  }

  public  setCvItem(cv_item: any) {

    //console.log('ВОТ cv_item',cv_item);

    window.localStorage.setItem('_cvitem', JSON.stringify(cv_item));
    this._cvitem  = cv_item;
  }

  public  getCvItem(): any {

    if (window.localStorage.getItem('_cvitem') !== '' && window.localStorage.getItem('_cvitem') !== 'undefined') {
      return this._cvitem = JSON.parse(window.localStorage.getItem('_cvitem'));
    } else {
      return this._cvitem;
    }
  }

  getCvPrevious(id_cv: number) {
    let sUrl = this.gr.sUrlGlobal+'CV_Previous';

    let params = new HttpParams()
      .set('id_cv', id_cv.toString())

    return this.http.get(sUrl, {params: params} );
  }

  getCvLanguage(id_cv: number) {
    let sUrl = this.gr.sUrlGlobal+'CV_Language';

    let params = new HttpParams()
      .set('id_cv', id_cv.toString())

    return this.http.get(sUrl, {params: params});
  }




}
