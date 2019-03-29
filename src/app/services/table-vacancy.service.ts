import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subject, Subscription} from 'rxjs';
import {HomeComponent} from '../home/home.component';
import {dataVacancy} from '../class/Vacancy';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class TableVacancyService {


  private _messageAdvancedFindObj: any = null;

  private _id_user: number;
  private _id_vc: number;

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



  private _onReopenVacancy = new Subject<{sMask: string, isFavorites: boolean, isAdvancedFind: boolean}>();

  //onReopenVacancyAdvanced - продвинутый поиск вакансий, запускается из advanced-search.component, подписан в  HomeComponent
  private _onReopenVacancyAdvanced = new Subject<any>();

  constructor(private http: HttpClient) {

    //расширенный поиск вакансий, запускается из advanced-search.component
    this.sbReopenVacancyAdvanced = this.onReopenVacancyAdvanced.subscribe((value: any) => {this._messageAdvancedFindObj = value; });

  }


  public get onReopenVacancy(): Observable<{sMask: string, isFavorites: boolean, isAdvancedFind: boolean}> { return this._onReopenVacancy.asObservable(); }
  public triggerReopenVacancy({sMask, isFavorites, isAdvancedFind}) {
    this._onReopenVacancy.next({sMask, isFavorites, isAdvancedFind});
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


  getTableVacancyAdvanced(findObject: any)
  {
    let sUrl = 'http://localhost:3000/advanced-search';
    let Result = this.http.post(sUrl,  findObject);
    return Result;
  }




  getTableVacancy(sMask: string, rowPerPage: number, currentPage: number, isFavorites: boolean, isAdvancedFind: boolean)
  {



    let sUrl = 'http://localhost:3000/Vacancy';
    let params = new HttpParams()
      .set('sMask', sMask);

    return this.http.get(sUrl, {params: params});

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


  getFavoritesVacancy(id_user: number)
  {
    let sUrl = 'http://localhost:3000/UserFavoritesUnit?id_user='+id_user;
    return this.http.get(sUrl);
  }


  postFavoritesVacancy(id_user: number, id_vc: number)
  {
    let sUrl = 'http://localhost:3000/UserFavoritesUnit';
    let sRs = {id_user: id_user, id_vc: id_vc}
    return this.http.post(sUrl, sRs);
  }

  checkFavoritesVacancy(id_user: number, id_vc: number)
  {
    let sUrl = 'http://localhost:3000/UserFavoritesUnit?id_user='+id_user+'&id_vc='+id_vc;
    return this.http.get(sUrl);
  }



  postUnshowVacancy(id_user: number, id_vc: number)
  {
    let sUrl = 'http://localhost:3000/UserDontShowUnit';
    let sRs = {id_user: id_user, id_vc: id_vc}
    return this.http.post(sUrl, sRs);
  }


  postResponse(id_user: number, id_vc: number)
  {
    this._id_user = id_user;
    this._id_vc = id_vc;
  }

  getResponse(): {'id_user': number, 'id_vc' : number}
  {
      return {id_user: this._id_user, id_vc: this._id_vc};
  }


  // проверяем наличие откликов данного юзера на данную вакансию
  getNumberResponse(id_user_from: number, id_vc: number) {
    // http://localhost:3000/Correspondence?letter.id_user_from=2&letter.id_vc=1
    let sUrl = 'http://localhost:3000/Correspondence?letter.id_user_from='+id_user_from.toString()+'&letter.id_vc='+id_vc.toString();
    return this.http.get(sUrl);
  }




}

