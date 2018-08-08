import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TableVacancyService {



  constructor(private http: HttpClient) { }


  getTableVacancy()
  {
    // вставить запрос типа select top 10 * from Vacancy или еще что такое же
    return this.http.get('http://localhost:3000/vacancy');
  }

  getCity()
  {
    // вставить запрос типа select top 10 * from City или еще что такое же
    return this.http.get('http://localhost:3000/City');
  }

}
