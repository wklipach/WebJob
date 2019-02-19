import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CvEditService {

  private _cvid: number = -1;
  private _cvitem: any;


  constructor(private http: HttpClient) { }


  public  setCvId(cv_id: number) {
    window.localStorage.setItem('_cvid', JSON.stringify(cv_id));
    this._cvid = cv_id;
  }

  public  getCvId(): number {
    if (window.localStorage.getItem('_cvid') !== '') {
      return this._cvid = JSON.parse(window.localStorage.getItem('_cvid'));
    } else
    return this._cvid;
  }

  public  setCvItem(cv_item: any) {
    window.localStorage.setItem('_cvitem', JSON.stringify(cv_item));
    this._cvitem  = cv_item;
  }

  public  getCvItem(): any {
    if (window.localStorage.getItem('_cvitem') !== '') {
      return this._cvitem = JSON.parse(window.localStorage.getItem('_cvitem'));
    } else
      return this._cvitem;
  }

  getCvPrevious(id_cv: number) {
    let sUrl = 'http://localhost:3000/CV_Previous/'+id_cv;
    return this.http.get(sUrl);
  }

  getCvLanguage(id_cv: number) {
    let sUrl = 'http://localhost:3000/CV_Language?id_cv='+id_cv;
    return this.http.get(sUrl);
  }




}
