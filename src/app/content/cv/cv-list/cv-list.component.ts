import { Component, OnInit } from '@angular/core';
import {CvListService} from '../../../services/cv-list.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../services/auth-service.service';
import {GuideService} from '../../../services/guide-service.service';
import {City} from '../../../class/City';

@Component({
  selector: 'app-cv-list',
  templateUrl: './cv-list.component.html',
  styleUrls: ['./cv-list.component.css']
})
export class CvListComponent implements OnInit {

  protected cvList : any;
  protected  cityList: City[];
  private id_user: number;
  private  bConnected: boolean;

  private cvlistGetCvList: Subscription;
  private cvCity: Subscription;
  private cvDeleteCv: Subscription;

  constructor( private cls : CvListService,
               private authService: AuthService,
               private  gs: GuideService) {

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



  EditElement(item: any) {
    console.log('EDIT');
  }

  DeleteElement(item: any) {
    item.cv.bInvisible = true;
    console.log('new DELETE item', item, item.id);

    this.cvDeleteCv = this.cls.setDeleteCv(item.id, item).subscribe(()=> console.log('СДЕЛАЛИ'), err => console.log(err) );

  }

}
