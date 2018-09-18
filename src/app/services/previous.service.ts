import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Previous} from '../class/Previous';

@Injectable({
  providedIn: 'root'
})
export class PreviousService {

  private _cPrevious: Previous[] = [];



  private _onCheckPrevious = new Subject<number>();
  private _onNumberPrevious = new Subject<number>();
  private _onLoadPrevious = new Subject<Previous>();


  /*  СОБЫТИЕ УДАЛЕНИЯ ДИНАМИЧЕСКОГО БЛОКА "ПРЕДЫДУЩЕЕ МЕСТО РАБОТЫ" в создании нового резяме
      вызывается из комнонента app-cv-previous, подписка в компоненте app-newcv  */
  private _onDeletePrevious = new Subject<number>();

  constructor() {

  }


  public get onDeletePrevious(): Observable<number> { return this._onDeletePrevious.asObservable(); }
  public startOnDeletePrevious(value: number): number {
    this._onDeletePrevious.next(value);
    return value;
  }


  public get onNumberPrevious(): Observable<number> { return this._onNumberPrevious.asObservable(); }
  public startOnNumberPrevious(value: number): number {
    this._onNumberPrevious.next(value);
    return value;
  }

  public get onCheckPrevious(): Observable<number> { return this._onCheckPrevious.asObservable(); }

  /* запуск события onCheckPrevious для сбора данных из множащегося блока в резяюме  */
  public startCheckPrevious(value: number): Previous[] {
    this._onCheckPrevious.next(value);
    return this.getPrevious();
  }

  // событие загрузки данных в множащийся блок
  public get onLoadPrevious(): Observable<Previous> { return this._onLoadPrevious.asObservable(); }
  public startLoadPrevious(value: Previous) {
    this._onLoadPrevious.next(value);
  }



  /* Удалить один или все динамические блоки Передыдущее место работы */
  public clearPrevious(i: number) {


    console.log('ЧИСТИМ НОМЕР В ОСОБОМ СПИСКЕ ГДЕ ДАННЫЕ', i);

    if (this._cPrevious.length > 0) {
      if (i <= 0) {
        this._cPrevious.splice(0, this._cPrevious.length);
      }
      else {
        this._cPrevious.splice(i, 1);
      }
    } // end cPrevious.length > 0
  }


  public getCountPrevious(): number {
    return this._cPrevious.length;
  }


  public setPrevious(value: Previous) {
     this._cPrevious.push(value);
    }

  public getPrevious(): Previous[] {
    return this._cPrevious;
  }


}
