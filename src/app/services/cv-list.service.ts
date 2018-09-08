import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CvListService {

  constructor(private http: HttpClient) { }

  // получение списка резюме данного юзера, котопрые пока не удалены
  getCvList(id_user: number)
  {
    let sUrl = 'http://localhost:3000/CV?cv.id_user='+id_user+'&cv.bInvisible=false';

    console.log(sUrl);

    return this.http.get(sUrl);
  }


  setDeleteCv(id_cv: number, body) {

    let sUrl = 'http://localhost:3000/CV?id=' + id_cv;

    console.log('body', body);

    return this.http.patch(sUrl, body);
  }
  // http://localhost:3000/City?dddid_ne=1

}
