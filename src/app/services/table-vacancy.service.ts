import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject, Subscription} from 'rxjs';
import {HomeComponent} from '../home/home.component';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class TableVacancyService {


  private _messageAdvancedFindObj: any = null;

  public getMessageAdvancedFindObj () {
    return this._messageAdvancedFindObj;
  }

  public setMessageAdvancedFindObj (messageAdvancedFindObj: any) {
    this._messageAdvancedFindObj = messageAdvancedFindObj;
  }

  public clearAdvancedFindObj () {
    this._messageAdvancedFindObj = null;
  }


  private sbReopenVacancyAdvanced: Subscription;



  private _onReopenVacancy = new Subject<string>();

  //onReopenVacancyAdvanced - продвинутый поиск вакансий, запускается из advanced-search.component, подписан в  HomeComponent
  private _onReopenVacancyAdvanced = new Subject<any>();

  constructor(private http: HttpClient) {

    //расширенный поиск вакансий, запускается из advanced-search.component
    this.sbReopenVacancyAdvanced = this.onReopenVacancyAdvanced.subscribe((value: any) => {this._messageAdvancedFindObj = value; });

  }


  public get onReopenVacancy(): Observable<string> { return this._onReopenVacancy.asObservable(); }
  public triggerReopenVacancy(value: string) {
    this._onReopenVacancy.next(value);
  }


  public get onReopenVacancyAdvanced(): Observable<any> { return this._onReopenVacancyAdvanced.asObservable(); }

  public triggerReopenVacancyAdvanced(value: any): void {
    this._onReopenVacancyAdvanced.next(value);
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

  ngOnDestroy(): void {

    if (typeof this.sbReopenVacancyAdvanced !== 'undefined') {
      this.sbReopenVacancyAdvanced.unsubscribe();
    }

  }


  postFavoritesVacancy(id_user: number, id_vc: number)
  {
    let sUrl = 'http://localhost:3000/UserFavoritesUnit';
    let sRs = {id_user: id_user, id_vc: id_vc}
    return this.http.post(sUrl, sRs);
  }


  postUnshowVacancy(id_user: number, id_vc: number)
  {
    let sUrl = 'http://localhost:3000/UserDontShowUnit';
    let sRs = {id_user: id_user, id_vc: id_vc}
    return this.http.post(sUrl, sRs);
  }




}

