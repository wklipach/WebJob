import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {City} from '../../../class/City';
import {ComponentFactory} from '@angular/core/src/linker/component_factory';
import {CvPreviousComponent} from '../cv-previous/cv-previous.component';
import {PreviousService} from '../../../services/previous.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {CvEditService} from '../../../services/cv-edit.service';
import {GuideService} from '../../../services/guide-service.service';
import {Previous} from '../../../class/Previous';

@Component({
  selector: 'app-cv-edit',
  templateUrl: './cv-edit.component.html',
  styleUrls: ['./cv-edit.component.css']
})
export class CvEditComponent implements OnInit, OnDestroy {

  @ViewChild('spot', {read: ViewContainerRef}) vc;
  factoryPreviousComponent: ComponentFactory<CvPreviousComponent>;


  editCVForm: FormGroup;
  listCity : City[] =[];
  index: number = 0;
  cv_id: number = 0;
  private _cvitem: any;
  private _myDisplayCity: string;

  /*  ссылки на созданные компоненты */
  componentsReferences = [];


  //подписки
  private sbCvID: Subscription;
  private cveditCityTable: Subscription;


  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private is: GuideService,
              private ps: PreviousService,
              private cveditserv: CvEditService)
   {

    this.factoryPreviousComponent =  this.componentFactoryResolver.resolveComponentFactory(CvPreviousComponent);
    this.editCVForm = new FormGroup({
      'inputSalaryFrom': new FormControl('',[]),
      'position': new FormControl('',[]),
      'inputCity' : new FormControl('',[]),
    });

  }

    ngOnInit() {

//      this.sbCvID = this.route.params.subscribe(params => {
//        this.cv_id = params['cv_id'];
//      });

      this.cv_id =  this.cveditserv.getCvId();

      if (this.cv_id>-1) this._cvitem = this.cveditserv.getCvItem();

      console.log('получили _cvitem', this._cvitem);

      this.loadCurrentResume(this._cvitem);

  }


  loadCurrentResume(item: any) {


    // редактируемая зарплата
    if (typeof item.SalaryFrom !== 'undefined') {
      this.editCVForm.controls['inputSalaryFrom'].setValue(item.SalaryFrom);
    }

    //редактируемая должность (она же позиция)
    if (typeof item.Position !== 'undefined') {
      this.editCVForm.controls['position'].setValue(item.Position);
    }

    // редактируемый список городов по подписке с выбранным ранее городом в качестве выбранного
      this.cveditCityTable =  this.is.getCityTable().subscribe(
        (data: City[]) => {
          this.listCity = data;

          if (typeof item.City !== 'undefined') {
            if (this.listCity.length > 0) this._myDisplayCity = this.listCity[item.City - 1].name;
          } else {
            if (this.listCity.length > 0) this._myDisplayCity = this.listCity[0].name;
          }
          this.editCVForm.controls['inputCity'].setValue(this._myDisplayCity);
        }
      );

    //ставим чек-боксы в элементах ОТРАСЛЬ
     this.is.startCheckedElementIndustryList(item.Industry);
     //ставим чек-боксы в элементах  ЗАНЯТОСТЬ
    this.is.startCheckedElementEmploymentList(item.Employment);
    //ставим чек-боксы в элементах  график работы
    this.is.startCheckedElementScheduleList(item.Schedule);
    //ставим чек-боксы в элементах  Опыт работы
    this.is.startCheckedElementExperienceList(item.Experience);
    //ставим чек-боксы в элементах  Образование
    this.is.startCheckedElementEducationList(item.Education);


    this.cveditserv.getCvPrevious(this.cv_id).subscribe((value: any)=>{
       if (typeof value.previous !== 'undefined') {
           if (value.previous.length>0) {
               value.previous.forEach((curPrevious) => {
                     console.log('curPrevious',curPrevious);
                     this.createNewBlock(curPrevious);
                     // this.ps.startLoadPrevious(curPrevious);
             });
            }
       }


    });

  }

  ngOnDestroy() {
    if (typeof  this.sbCvID !== 'undefined') {
      this.sbCvID.unsubscribe();
    }

    if (typeof  this.cveditCityTable !== 'undefined') {
      this.cveditCityTable.unsubscribe();
    }

  }

  createNewBlock(curPrevious: Previous) {
    const componentRef =  this.vc.createComponent(this.factoryPreviousComponent);
    componentRef.instance.setIndex(++this.index);
    componentRef.instance.loaddata(curPrevious);
    this.componentsReferences.push(componentRef);
  }

  savecv() {

  }

}
