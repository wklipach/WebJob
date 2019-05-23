import { Injectable } from '@angular/core';
import {dataVacancy} from '../class/Vacancy';
import {Observable, of, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoveService {

  public oDataVacancy: dataVacancy;
  public cvidInvest: number;
  public sFind: string;
  public sNull: string;

  private _onNullFind = new Subject<string>();


  constructor() { }

  public getDataVacancy(): Observable<dataVacancy> {
    return of (this.oDataVacancy);
  }


  public getInvestCVID(): Observable<number> {
    return of (this.cvidInvest);
  }


  public setInvestCVID(cvid: number): Observable<boolean> {
    this.cvidInvest = cvid;
    return of (true);
  }


  public setDataVacancy(oDataVacancy: dataVacancy): Observable<boolean> {
    this.oDataVacancy = oDataVacancy;
    return of (true);
  }

  public getStringFind(): string {
    if (typeof this.sFind !== 'undefined')
      return this.sFind;
      else return '';
  }

  public setStringFind(sFind: string) {

    if (typeof sFind !== 'undefined')
      this.sFind = ''; else
      this.sFind = sFind;
  }


  public setNullValueFind(sNull: string) {

    if (typeof sNull === 'undefined')
      this.sNull = ''; else
      this.sNull = sNull;
  }

  public getNullValueFind(): string {
    if (typeof this.sNull !== 'undefined')
      return this.sNull;
    else return '';
  }



  public get onNullFind(): Observable<string> { return this._onNullFind.asObservable(); }
  public startNullFind(value: string): boolean {
    this._onNullFind.next(value);
    return true;
  }




}










