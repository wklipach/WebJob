import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VacanciesListService {

  private _vacid: number = -1;
  private _vacitem: any;


  constructor(private http: HttpClient) { }

  getVacanciesList(id_user: number) {

        let sUrl = 'http://localhost:3000/Vacancy?vacancy.id_user='+id_user+'&vacancy.bInvisible=false';
        console.log('sUrl =', sUrl);
    return this.http.get(sUrl);
  }

  setDeleteVac(id_vac: number, vacbody) {
    let sUrl = 'http://localhost:3000/Vacancy/'+id_vac;

    return this.http.patch(sUrl,
      {
        vacancy: vacbody
      }
    );
  }

  public  setVacId(vac_id: number) {
    window.localStorage.setItem('_vacid', JSON.stringify(vac_id));
    this._vacid = vac_id;
  }

  public  getVacId(): number {
    if (window.localStorage.getItem('_vacid') !== '') {
      return this._vacid = JSON.parse(window.localStorage.getItem('_vacid'));
    } else
      return this._vacid;
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


}
