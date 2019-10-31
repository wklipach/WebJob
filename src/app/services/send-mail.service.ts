import { Injectable } from '@angular/core';
import {GlobalRef} from './globalref';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SendMailService {

  constructor(private http: HttpClient, private gr: GlobalRef) { }


  public  getSendMailUserMask(id_user: number) {
      //console.log('ОПТИМИЗАЦИЯ: ТУТ ГРУЗИМ КАРТИНКУ');
      //
      let sUrl = this.gr.sUrlGlobal+'UserTable';
      let params = new HttpParams()
        .set('id_user_mm', id_user.toString())
      return this.http.get(sUrl, {params: params} );
  }


  public  setSendMailUserMask(id_user: number, sMask: string, bChecked: boolean) {
    let nMask: any = {};
    nMask.nMask = 'nMask';
    nMask.id_user = id_user;
    nMask.sMask = sMask;
    nMask.bChecked =  bChecked;
    return this.http.post(this.gr.sUrlGlobal+'UserTable', nMask);
}


}
