import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Vacancy} from '../class/Vacancy';
import {Previous} from '../class/Previous';

@Injectable()
export class NewVacancyService {

  constructor(private http: HttpClient) { }


  // на сервере в отдельной пустой процедуре!!!
  postNewVacancy(vacancy: Vacancy) {
    return this.http.post('http://localhost:3000/Vacancy/', {vacancy});
  }


  // на сервере в процедуре с параметрами!!!!!
  postVacancy(vacancy: Vacancy) {
    return this.http.post('http://localhost:3000/Vacancy/'+vacancy.id+'/false/true', {vacancy});
  }

}
