import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(private http: HttpClient) { }


  // получение корреспонденции данного юзера
  getListInfo(id_user: number)
  {
    let sUrl ='http://localhost:3000/Info?id_user_to='+id_user+'&id_user_to=-1';
    return this.http.get(sUrl);

  }

  // получение одной информации по номеру
  getAnyInfo(id_info: number)
  {
    let sUrl ='http://localhost:3000/Info?id='+id_info;
    return this.http.get(sUrl);
  }




}
