import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {GlobalRef} from './globalref';

@Injectable({
  providedIn: 'root'
})
export class VacanciesListService {

  private _vacid: number = -1;
  private _vacitem: any;


  constructor(private http: HttpClient, private gr: GlobalRef) { }

  getVacanciesList(id_user: number) {

    let sUrl = this.gr.sUrlGlobal+'Vacancy';
    let params = new HttpParams()
    .set('id', id_user.toString())
    .set('id_user', id_user.toString())

    return this.http.get(sUrl, {params: params});

    // return this.http.get(sUrl, myParams);
  }


  getVacAny(id_vc: number) {

    let sUrl = this.gr.sUrlGlobal+'Vacancy';
    let params = new HttpParams()
      .set('AnyVacancy', id_vc.toString())

    return this.http.get(sUrl, {params: params});

    // return this.http.get(sUrl, myParams);
  }


  setDeleteVac(id_vac: number, vacbody) {
    let sUrl = this.gr.sUrlGlobal+'Vacancy/'+id_vac+'/'+vacbody.bInvisible+'/false';

    return this.http.post(sUrl,'');
  }

  public  setVacId(vac_id: number) {
    window.localStorage.setItem('_vacid', JSON.stringify(vac_id));
    this._vacid = vac_id;
  }

  public  getVacId(): number {

    if (window.localStorage.getItem('_vacid') !== '') {
      return this._vacid = JSON.parse(window.localStorage.getItem('_vacid'));
    } else {
      return this._vacid;
    }
  }

  public  setVacItem(vac_item: any) {
    window.localStorage.setItem('_vacitem', JSON.stringify(vac_item));
    this._vacitem  = vac_item;
  }

  public  getVacItem(): any {

    if (window.localStorage.getItem('_vacitem') !== '') {
        return this._vacitem = JSON.parse(window.localStorage.getItem('_vacitem'));
    } else
      return this._vacitem;
  }

  getVc(id_vc: number) {
    let sUrl = this.gr.sUrlGlobal+'Vacancy';
    let params = new HttpParams()
      .set('id_vc', id_vc.toString())
    return this.http.get(sUrl, {params: params});
  }



}
