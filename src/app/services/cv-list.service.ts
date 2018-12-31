import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Letter} from '../class/Letter';

@Injectable({
  providedIn: 'root'
})
export class CvListService {

  constructor(private http: HttpClient) { }

  // получение списка резюме данного юзера, котопрые пока не удалены
  getCvList(id_user: number) {
    const sUrl = 'http://localhost:3000/CV?cv.id_user=' + id_user + '&cv.bInvisible=false';
    console.log(sUrl);
    return this.http.get(sUrl);
  }


  setDeleteCv(id_cv: number, cvbody) {
      const sUrl = 'http://localhost:3000/CV/' + id_cv;
      return this.http.patch(sUrl,
        {
          cv: cvbody
        }
      );
  }


  setCorrespondence(letter: Letter) {
    const sUrl = 'http://localhost:3000/Correspondence';
    return this.http.post(sUrl, {letter});
  }



}
