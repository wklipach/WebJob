import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableVacancyService {



  constructor(private http: HttpClient) { }


  private _onReopenVacancy = new Subject<string>();

  public get onReopenVacancy(): Observable<string> { return this._onReopenVacancy.asObservable(); }

  public triggerReopenVacancy(value: string) {
    this._onReopenVacancy.next(value);
  }



  /*
  Full-text search
  Add q
  GET /posts?q=internet
  */

  getTableVacancy(sMask: string)
  {
    let sUrl = 'http://localhost:3000/vacancy';
    if (sMask !== '') sUrl = sUrl +'?q='+sMask;
    // вставить запрос типа select top 10 * from Vacancy по маске или еще что такое же
    return this.http.get(sUrl);
  }

  getCity()
  {
    // вставить запрос типа select top 10 * from City или еще что такое же
    return this.http.get('http://localhost:3000/City');
  }




}

