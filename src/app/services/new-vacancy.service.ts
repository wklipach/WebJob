import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Vacancy} from '../class/Vacancy';
import {GlobalRef} from './globalref';

@Injectable()
export class NewVacancyService {

  constructor(private http: HttpClient, private gr: GlobalRef) { }


  // на сервере в отдельной пустой процедуре!!!
  postNewVacancy(vacancy: Vacancy) {
    return this.http.post(this.gr.sUrlGlobal+'Vacancy/', {vacancy});
  }


  // на сервере в процедуре с параметрами!!!!!
  postVacancy(vacancy: Vacancy) {
    return this.http.post(this.gr.sUrlGlobal+'Vacancy/'+vacancy.id+'/false/true', {vacancy});
  }

}
