import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Vacancy} from '../class/Vacancy';

@Injectable()
export class NewVacancyService {

  constructor(private http: HttpClient) { }

  postNewVacancy(vacancy: Vacancy) {
    return this.http.post('http://localhost:3000/Vacancy', {vacancy});
  }

}
