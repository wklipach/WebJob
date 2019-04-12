import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin} from 'rxjs';
import {GlobalRef} from './globalref';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(private http: HttpClient, private gr: GlobalRef) { }


  // получение корреспонденции данного юзера
  getListInfo(id_user: number)
  {
    let sUrl =this.gr.sUrlGlobal+'Info/'+id_user+'/-1';
    return this.http.get(sUrl);

  }

  // получение одной информации по номеру
  getAnyInfo(id_info: number)
  {
    let sUrl =this.gr.sUrlGlobal+'Info?id='+id_info;
    return this.http.get(sUrl);
  }




}
