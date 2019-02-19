import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Previous} from '../class/Previous';
import {Language} from '../class/Language';

@Injectable({
  providedIn: 'root'
})
export class CvLanguageService {

  private _cLanguage: Language[] = [];
  private _onCheckLanguage = new Subject<number>();
  private _onDeleteLanguage = new Subject<number>();
  constructor() { }


  public get onCheckLanguage(): Observable<number> { return this._onCheckLanguage.asObservable(); }

  public get onDeleteLanguage(): Observable<number> { return this._onDeleteLanguage.asObservable(); }
  public startOnDeleteLanguage(value: number): number {
    this._onDeleteLanguage.next(value);
    return value;
  }

  /* Удалить один или все динамические блоки Передыдущее место работы */
  public clearLanguage(i: number) {
    console.log('ЧИСТИМ НОМЕР В ОСОБОМ СПИСКЕ ГДЕ ДАННЫЕ', i);
    if (this._cLanguage.length > 0) {
      if (i <= 0) {
        this._cLanguage.splice(0, this._cLanguage.length);
      }
      else {
        this._cLanguage.splice(i, 1);
      }
    } // end cPrevious.length > 0
  }


  /* запуск события onCheckPrevious для сбора данных из множащегося блока в резяюме  */
  public startCheckLanguage(value: number): Language[] {
    this._onCheckLanguage.next(value);
    return this.getLanguage();
  }

  public getLanguage(): Language[] {
    return this._cLanguage;
  }

  public setLanguage(value: Language) {
    this._cLanguage.push(value);
  }

}


