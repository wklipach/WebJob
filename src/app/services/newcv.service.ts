import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CV} from '../class/CV';
import {Previous} from '../class/Previous';

@Injectable({
  providedIn: 'root'
})
export class NewcvService {

  constructor(private http: HttpClient) { }

  postNewCV(cv: CV) {
    return this.http.post('http://localhost:3000/CV', {cv});
  }

  postPrevious(previous: Previous[]) {
    return this.http.post('http://localhost:3000/CV_Previous', {previous});
  }


}
