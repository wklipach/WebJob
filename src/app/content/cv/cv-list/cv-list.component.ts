import {Component, OnDestroy, OnInit} from '@angular/core';
import {CvListService} from '../../../services/cv-list.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../services/auth-service.service';
import {GuideService} from '../../../services/guide-service.service';
import {City} from '../../../class/City';
import {Router} from '@angular/router';
import {CvEditService} from '../../../services/cv-edit.service';
import {FormGroup} from '@angular/forms';
import {CV} from '../../../class/CV';
import {NewcvService} from '../../../services/newcv.service';
import {Previous} from '../../../class/Previous';


@Component({
  selector: 'app-cv-list',
  templateUrl: './cv-list.component.html',
  styleUrls: ['./cv-list.component.css']
})

export class CvListComponent implements OnInit, OnDestroy {



  contactMethods = [];

  private _numberModel: number;

  protected get CvListItem(): number {
    return this._numberModel;
  }

  protected set CvListItem(a: number) {
    this._numberModel = a;
  }

  cvListForm: FormGroup;
  protected cvList: any;
  protected  cityList: City[];
  private id_user: number;
  private  bConnected: boolean;

  private cvlistGetCvList: Subscription;
  private cvCity: Subscription;
  private cvDeleteCv: Subscription;

  constructor( private cls: CvListService,
               private authService: AuthService,
               private  gs: GuideService,
               private router: Router,
               private cveditserv: CvEditService,
               private newcvserv: NewcvService) {


    this.CvListItem = 0;

  }

  ngOnInit() {


    const Res =  this.authService.loginStorage();
    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;


    this.cvCity = this.gs.getCityTable().subscribe((value) => {
        this.cityList = value as City[];
        this.cvlistGetCvList = this.cls.getCvList(this.id_user).subscribe((valueCL) => {
                this.cvList = valueCL;
                this.cvList.forEach( (cvCur, index) => {
                  this.contactMethods.push({'id' : 0, value : 0, 'bDelete': false});
                    const sCityName = (this.cityList as City[]).find((valueC) => (valueC.id === cvCur.cv.City) ).name;
                    this.cvList[index].CityName = sCityName;
                });


            console.log('this.cvList', this.cvList);
          });
    });
}

  brokerSelected ($event, item, i) {

    // console.log($event.target.value);

// TODO СОБЫТИЕ СПИСКА
    switch ($event.target.value) {

      case '0': {
        this.contactMethods[i].bDelete = false;
        this.CvListItem = 0;
        this.contactMethods[i].id = 0;
        console.log('!!!!this.contactMethods', this.contactMethods);
        break;
      }

      case '1': {
        this.contactMethods[i].bDelete = false;
        this.CvListItem = 1;
        this.contactMethods[i].id = 1;
        console.log('!!!!this.contactMethods', this.contactMethods);
        this.ViewElement(item);
        break;
      }
      case '2': {
        this.CvListItem = 2;
        this.contactMethods[i].bDelete = false;
        this.contactMethods[i].id = 2;
        console.log('!!!!this.contactMethods', this.contactMethods);
        this.EditElement(item);
        break;
      }
      case '3': {
        this.contactMethods[i].bDelete = false;
        this.CvListItem = 3;
        this.contactMethods[i].id = 3;
        this.copyCV(item);
        console.log('Создать копию');
        break;
      }
      case '4': {
        this.contactMethods[i].bDelete = true;
        this.contactMethods[i].id = 4;
        this.CvListItem = 4;
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


  newcv() {
    this.router.navigate(['/newcv']);
  }


  // редактируем - по факту будем удалять пометкой "удаленное" но оставляя в базе и вписывая новое значение
  EditElement(item: any) {
   // this.router.navigate(['/cv-edit'],{ queryParams:{'cv_id': item.id,}});

    this.cveditserv.setCvId(item.id);
    this.cveditserv.setCvItem(item.cv);
    this.router.navigate(['/cv-edit']);
  }

  // просмотр резюме
  ViewElement(item: any) {
    this.cveditserv.setCvId(item.id);
    this.cveditserv.setCvItem(item.cv);
    this.router.navigate(['/cv-view']);
  }



  CheckDeleteElement(item: any) {
    item.cv.bInvisible = true;

  }

  UnDeleteElement(item: any, i: number) {
    this.contactMethods[i].bDelete = false;
    item.cv.bInvisible = false;
    this.CvListItem = 0;
  }


  RouterReload() {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
    this.router.navigated = false;

    this.router.navigate([this.router.url]);
  }


  // удаляем - по факту ставим признак невидимости элемента
  DeleteElement(item: any, i: number) {
    this.contactMethods[i].bDelete = true;
    item.cv.bInvisible = true;
    this.cvDeleteCv = this.cls.setDeleteCv(item.id, item.cv).subscribe( () => {
                                                                        console.log('удалили элемент', item.id);
                                                                        this.RouterReload();
                                                                        },
 err => console.log('при удалении элемента возникла нештатная ситуация ', err));

  }


  /* сохранение данных */
  copyCV(item) {

    // получаем изначальные данные без динамических блоков
    const MyCv: CV = item.cv;
    this.newcvserv.postNewCV(MyCv).subscribe(
      (value) => {
        console.log('a1');
        const id = value['id'];
        console.log('a1', id);
        const curPrevious:  Previous[] = [];
        const cPrevious: any = curPrevious;
        cPrevious.id_cv = id;
        console.log('cPrevious', cPrevious);
        this.newcvserv.postPrevious(cPrevious).subscribe(
          () => {
            this.RouterReload();
            }
        );

      });
  }

}
