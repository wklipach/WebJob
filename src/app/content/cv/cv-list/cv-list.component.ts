import { Component, OnInit } from '@angular/core';
import {CvListService} from '../../../services/cv-list.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../services/auth-service.service';
import {GuideService} from '../../../services/guide-service.service';
import {City} from '../../../class/City';
import {Router} from '@angular/router';
import {CvEditService} from '../../../services/cv-edit.service';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-cv-list',
  templateUrl: './cv-list.component.html',
  styleUrls: ['./cv-list.component.css']
})
export class CvListComponent implements OnInit {


  cvListForm: FormGroup;
  protected cvList: any;
  protected  cityList: City[];
  private id_user: number;
  private  bConnected: boolean;

  private cvlistGetCvList: Subscription;
  private cvCity: Subscription;
  private cvDeleteCv: Subscription;

  constructor( private cls : CvListService,
               private authService: AuthService,
               private  gs: GuideService,
               private router: Router,
               private cveditserv: CvEditService) {
  }

  ngOnInit() {


    var Res =  this.authService.loginStorage();
    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;


    this.cvCity = this.gs.getCityTable().subscribe((value) => {
        this.cityList = value as City[];
        this.cvlistGetCvList = this.cls.getCvList(this.id_user).subscribe((value) =>
          {
                this.cvList = value;
                this.cvList.forEach( (cvCur, index) => {
                    let sCityName = (this.cityList as City[]).find((value) => (value.id === cvCur.cv.City) ).name;
                    this.cvList[index].CityName = sCityName;
                });
          }
          )}
    );

}

  brokerSelected ($event) {
    switch ($event.target.value) {
      // 1: '';
      // 2: '';
      case 1: {
        console.log('просмотр');
        break;
      }
      case 2: {
        console.log('Редактировать');
        break;
      }
      case 3: {
        //statements;
        console.log('Создать копию');
        break;
      }
      case 4: {
        console.log('Удалить');
        break;
      }
      default: {
        break;
      }
    }
}

  OpenCV() {
    console.log('просмотр резюме');
  }

  EditCV() {
    console.log('редактирование резюме');
  }


  ngOnDestroy() {
    if (typeof  this.cvlistGetCvList !== 'undefined') {
      this.cvlistGetCvList.unsubscribe();
    }

    if (typeof  this.cvCity !== 'undefined') {
      this.cvCity.unsubscribe();
    }

    if (typeof  this.cvDeleteCv !== 'undefined') {
      this.cvDeleteCv.unsubscribe();
    }

  }


  newcv(){
    this.router.navigate(['/newcv']);
  }


  // редактируем - по факту будем удалять пометкой "удаленное" но оставляя в базе и вписывая новое значение
  EditElement(item: any) {
   // this.router.navigate(['/cv-edit'],{ queryParams:{'cv_id': item.id,}});

    this.cveditserv.setCvId(item.id);
    this.cveditserv.setCvItem(item.cv);
    this.router.navigate(['/cv-edit']);
  }


  CheckDeleteElement(item: any) {
    item.cv.bInvisible = true;

  }

  UnDeleteElement(item: any) {
    item.cv.bInvisible = false;
  }


  RouterReload() {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
    this.router.navigated = false;

    this.router.navigate([this.router.url]);
  }


  // удаляем - по факту ставим признак невидимости элемента
  DeleteElement(item: any) {
    item.cv.bInvisible = true;
    this.cvDeleteCv = this.cls.setDeleteCv(item.id, item.cv).subscribe( ()=> {
                                                                        console.log('удалили элемент', item.id);
                                                                        this.RouterReload();
                                                                        },
 err => console.log('при удалении элемента возникла нештатная ситуация ',err));
  }

}
