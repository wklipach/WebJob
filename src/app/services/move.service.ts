import { Injectable } from '@angular/core';
import {dataVacancy} from '../class/Vacancy';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoveService {

  public oDataVacancy: dataVacancy;
  constructor() { }

  public getDataVacancy(): Observable<dataVacancy> {
    return of (this.oDataVacancy);
  }

  public setDataVacancy(oDataVacancy: dataVacancy): Observable<boolean> {
    this.oDataVacancy = oDataVacancy;
    return of (true);
  }

}










