import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalRef} from './globalref';

@Injectable({
  providedIn: 'root'
})
export class ForgotpasswordService {

  constructor(private http: HttpClient, private gr: GlobalRef) { }

  sendPassword(email: string) {
    const sUrl = this.gr.sUrlGlobal+'forgotpassword';
    return this.http.post(sUrl, {email});
  }


}
