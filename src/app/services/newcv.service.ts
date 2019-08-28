import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CV} from '../class/CV';
import {AdvancedPrevious} from '../class/Previous';
import {AdvancedLanguage, Language} from '../class/Language';
import {GlobalRef} from './globalref';


@Injectable({
  providedIn: 'root'
})
export class NewcvService {

  constructor(private http: HttpClient, private gr: GlobalRef) { }

  postNewCV(cv: CV) {
    cv['InsertCV'] = 'true';
    return this.http.post(this.gr.sUrlGlobal+'CV', {cv});
  }

  postCopyCV(cv: CV) {
    cv['CopyCV'] = 'true';
    return this.http.post(this.gr.sUrlGlobal+'CV', {cv});
  }


  postUpdateCV(cv: CV) {
    cv['UpdateCV'] = 'true';

    //console.log(cv);

    return this.http.post(this.gr.sUrlGlobal+'CV', {cv});
  }


  postPrevious(previous: AdvancedPrevious) {

      return this.http.post(this.gr.sUrlGlobal+'cv_previous', {previous});
  }

  postLanguage(language: AdvancedLanguage) {
     return this.http.post(this.gr.sUrlGlobal+'cv_language', {language});
  }




}
