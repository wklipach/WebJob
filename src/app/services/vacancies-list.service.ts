import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VacanciesListService {

  constructor(private http: HttpClient) { }

  getVacanciesList(id_user: number) {
    let sUrl = 'http://localhost:3000/Vacancy?id_user='+id_user;
    return this.http.get(sUrl);
  }

  setDeleteVac(id_vac: number, vacbody) {
    let sUrl = 'http://localhost:3000/Vacancy/'+id_vac;

    return this.http.patch(sUrl,
      {
        vacancy: vacbody
      }
    );
  }



}
