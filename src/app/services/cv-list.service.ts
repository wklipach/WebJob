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


  setDeleteCv(id_cv: number, cvbody) {

      let sUrl = 'http://localhost:3000/CV/'+id_cv;

      return this.http.patch(sUrl,
        {
          cv: cvbody
        }
      );

  }


}
