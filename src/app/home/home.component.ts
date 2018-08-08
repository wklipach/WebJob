import { Component, OnInit } from '@angular/core';
import {TableVacancyService} from '../services/table-vacancy.service';
import {dataVacancy, Vacancy} from '../class/Vacancy';
import {City} from '../class/City';
import {isNullOrUndefined} from 'util';
import {Router} from '@angular/router';
import {MoveService} from '../services/move.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  myDataVacancy: dataVacancy[];
  private dvSubscription: Subscription;

  constructor(private httpService: TableVacancyService, private router: Router, private moveS: MoveService) {
  }

  ngOnInit() {
    this.getVacancy();
  }

  getVacancy() {
    return this.httpService.getTableVacancy().subscribe(
      (data: dataVacancy[]) => {
        //это получаем город из нового вызываемого сервиса
        this.httpService.getCity().subscribe((city: City[]) => {

          //  console.log('data', data);
           // console.log('city', city);

            data.forEach((eekey, ih) => {

              let idCity = eekey['vacancy'].City;
              if (isNullOrUndefined(idCity) === false) {
                let CurCity = city.find(city => city.id === idCity)
                eekey.CityName = CurCity.name;
              }
            });

            this.myDataVacancy = data;
            // console.log('this.myDataVacancy', this.myDataVacancy);
          }
        );
      }
    );
  }


  MyMethod(zid : number) {
    console.log('id--', zid);

    let vacancy = this.myDataVacancy.find(vacancy =>  vacancy.id===zid);
   // console.log('res--', vacancy);
    this.dvSubscription = this.moveS.setDataVacancy(vacancy).subscribe( ()=> this.router.navigate(['/description-vacancy']));
  }

  ngOnDestroy() {
    this.dvSubscription.unsubscribe();
  }

}

