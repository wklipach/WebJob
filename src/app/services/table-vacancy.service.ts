import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subject, Subscription} from 'rxjs';
import {GlobalRef} from './globalref';

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

  constructor(private http: HttpClient, private gr: GlobalRef) {

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
    let sUrl = this.gr.sUrlGlobal+'advanced-search';
    let Result = this.http.post(sUrl,  findObject);
    return Result;
  }




  getTableVacancy(sMask: string, rowPerPage: number, currentPage: number, isFavorites: boolean, isAdvancedFind: boolean, id_user?: number)
  {


    let curId_User = -1;
    if (id_user != null) curId_User = id_user;

    let sUrl = this.gr.sUrlGlobal+'Vacancy';

    let params: any;

    if (isFavorites) {
      params = new HttpParams()
        .set('sMask', sMask)
        .set('isFavorites', 'true')
        .set('id_user_current', curId_User.toString())
        .set('id_user_favorites', id_user.toString());
    }

    if (!isFavorites) {
      params = new HttpParams()
        .set('id_user_current', curId_User.toString())
        .set('sMask', sMask);
    }

    return this.http.get(sUrl, {params: params});

  }

  getCity()
  {
    // вставить запрос типа select top 10 * from City или еще что такое же
    return this.http.get(this.gr.sUrlGlobal+'City');
  }

  ngOnDestroy(): void {

    if (typeof this.sbReopenVacancyAdvanced !== 'undefined') {
      this.sbReopenVacancyAdvanced.unsubscribe();
    }

  }


  getFavoritesVacancy(id_user: number)
  {
    let sUrl = this.gr.sUrlGlobal+'UserFavoritesUnit?id_user='+id_user;
    return this.http.get(sUrl);
  }


  postFavoritesVacancy(id_user: number, id_vc: number)
  {
    let sUrl = this.gr.sUrlGlobal+'UserFavoritesUnit';
    let sRs = {id_user: id_user, id_vc: id_vc}
    return this.http.post(sUrl, sRs);
  }

  checkFavoritesVacancy(id_user: number, id_vc: number)
  {
    let sUrl = this.gr.sUrlGlobal+'UserFavoritesUnit?id_user='+id_user+'&id_vc='+id_vc;
    return this.http.get(sUrl);
  }



  postUnshowVacancy(id_user: number, id_vc: number)
  {
    let sUrl = this.gr.sUrlGlobal+'UserDontShowUnit';
    let sRs = {id_user: id_user, id_vc: id_vc};

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

    let sUrl = this.gr.sUrlGlobal+'Correspondence';
    let params = new HttpParams()
      .set('id_user_from', id_user_from.toString())
      .set('id_vc', id_vc.toString())
    return this.http.get(sUrl, {params: params});

  }




}

