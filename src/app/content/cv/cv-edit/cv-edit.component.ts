import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {City} from '../../../class/City';
import {ComponentFactory} from '@angular/core/src/linker/component_factory';
import {CvPreviousComponent} from '../cv-previous/cv-previous.component';
import {PreviousService} from '../../../services/previous.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {CvEditService} from '../../../services/cv-edit.service';
import {GuideService} from '../../../services/guide-service.service';
import {Previous} from '../../../class/Previous';
import {CvListService} from '../../../services/cv-list.service';
import {CV} from '../../../class/CV';
import {AuthService} from '../../../services/auth-service.service';
import {NewcvService} from '../../../services/newcv.service';

@Component({
  selector: 'app-cv-edit',
  templateUrl: './cv-edit.component.html',
  styleUrls: ['./cv-edit.component.css']
})
export class CvEditComponent implements OnInit, OnDestroy {

  @ViewChild('spot', {read: ViewContainerRef}) vc;
  factoryPreviousComponent: ComponentFactory<CvPreviousComponent>;


  editCVForm: FormGroup;
  listCity: City[] = [];
  index = 0;
  cv_id = 0;
  private _cvitem: any;
  private _myDisplayCity: string;

  /*  ссылки на созданные компоненты */
  componentsReferences = [];


  // подписки
  private sbCvID: Subscription;
  private cveditCityTable: Subscription;
  private subscrCvEditServ: Subscription;
  private cvDeleteCv: Subscription;
  private previousPostNewCV: Subscription;
  private previousPostPrevious: Subscription;


  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private is: GuideService,
              private authService: AuthService,
              private router: Router,
              private ps: PreviousService,
              private cveditserv: CvEditService,
              private cls: CvListService,
              private httpService: NewcvService) {

    this.factoryPreviousComponent =  this.componentFactoryResolver.resolveComponentFactory(CvPreviousComponent);
    this.editCVForm = new FormGroup({
      'inputSalaryFrom': new FormControl('', []),
      'position': new FormControl('', []),
      'inputCity' : new FormControl('', []),
      'industry' : new FormControl('', [])
    });

  }

    ngOnInit() {

//      this.sbCvID = this.route.params.subscribe(params => {
//        this.cv_id = params['cv_id'];
//      });

      this.cv_id =  this.cveditserv.getCvId();

      if (this.cv_id > -1) {
        this._cvitem = this.cveditserv.getCvItem();
      }

      console.log('получили _cvitem', this._cvitem);

      this.loadCurrentResume(this._cvitem);

  }


  loadCurrentResume(item: any) {


    // редактируемая зарплата
    if (typeof item.SalaryFrom !== 'undefined') {
      this.editCVForm.controls['inputSalaryFrom'].setValue(item.SalaryFrom);
    }

    // редактируемая должность (она же позиция)
    if (typeof item.Position !== 'undefined') {
      this.editCVForm.controls['position'].setValue(item.Position);
    }

    // редактируемый список городов по подписке с выбранным ранее городом в качестве выбранного
      this.cveditCityTable =  this.is.getCityTable().subscribe(
        (data: City[]) => {
          this.listCity = data;

          if (typeof item.City !== 'undefined') {
            if (this.listCity.length > 0) {
              this._myDisplayCity = this.listCity[item.City - 1].name;
            }
          } else {
            if (this.listCity.length > 0) {
              this._myDisplayCity = this.listCity[0].name;
            }
            }
          this.editCVForm.controls['inputCity'].setValue(this._myDisplayCity);
        });

    // ставим чек-боксы в элементах ОТРАСЛЬ
     this.is.startCheckedElementIndustryList(item.Industry);
     // ставим чек-боксы в элементах  ЗАНЯТОСТЬ
    this.is.startCheckedElementEmploymentList(item.Employment);
    // ставим чек-боксы в элементах  график работы
    this.is.startCheckedElementScheduleList(item.Schedule);
    // ставим чек-боксы в элементах  Опыт работы
    this.is.startCheckedElementExperienceList(item.Experience);
    // ставим чек-боксы в элементах  Образование
    this.is.startCheckedElementEducationList(item.Education);


    this.subscrCvEditServ = this.cveditserv.getCvPrevious(this.cv_id).subscribe((value: any) => {
       if (typeof value.previous !== 'undefined') {
           if (value.previous.length > 0) {
               value.previous.forEach((curPrevious) => {
                     console.log('curPrevious', curPrevious);
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

    if (typeof  this.subscrCvEditServ !== 'undefined') {
      this.subscrCvEditServ.unsubscribe();
    }

    if (typeof  this.cvDeleteCv !== 'undefined') {
      this.cvDeleteCv.unsubscribe();
    }

    if (typeof  this.previousPostNewCV !== 'undefined') {
      this.previousPostNewCV.unsubscribe();
    }

  }

  createNewBlock(curPrevious: Previous) {
    const componentRef =  this.vc.createComponent(this.factoryPreviousComponent);
    componentRef.instance.setIndex(++this.index);
    componentRef.instance.loaddata(curPrevious);
    this.componentsReferences.push(componentRef);
  }

  savecv() {
    // сохранение редактированного
    // 1-вый шаг помечаем данные таблицы  CV как удаленные, 2-вый шаг сохраняем заново
    this.UpdateCv(this._cvitem);
  }


  UpdateCv(item: any) {


    console.log('Смотрим строку ниже');
    console.log(item);
    item.bInvisible = true;

    this.cvDeleteCv = this.cls.setDeleteCv(this.cv_id, item).subscribe( () => {
        console.log('удалили элемент', this.cv_id);
        this.newcv();

        // this.router.navigate(['/cv-list']);
      },
      err => console.log('при удалении элемента возникла нештатная ситуация ', err));
  }


  /* сохранение данных */
  newcv() {

    // получаем изначальные данные без динамических блоков
    const MyCv: CV = this.loadMainCV();
    return this.previousPostNewCV = this.httpService.postNewCV(MyCv).subscribe(
      (value) => {
        // из возвращенного результата забираем новое ID
        const id = value['id'];
        const mPrevious = this.getPreviousData();
        // присваиваем полученный id_cv внутрь каждого блока
        mPrevious.forEach((cPrevious, ih) => {
            cPrevious.id_cv = id;
            // console.log('cPrevious=',cPrevious);
          }
        );

        // записываем массив блоков Previous[] в базу
        this.previousPostPrevious = this.httpService.postPrevious(mPrevious).subscribe(
          (value1) => {
            console.log('Данные успешно занесены.');
            this.router.navigate(['/cv-list']); }
        );
      }
    );
 }


  /* сохраняем резюме без динамических блоков, возвращаем номер сохраненного резюме */
  loadMainCV(): CV {
    const MyCv: CV = new CV();
    let MyIndustry: number[];
    let MySchedule: number[];
    let MyEmployment: number[];
    let MyEducation: number[];
    let MyExperience: number[];


    const Res =  this.authService.loginStorage();
    if (Res.bConnected) {
      MyCv.id_user = Res.id_user;
    } else {
      MyCv.id_user = -1;
    }





    MyIndustry = this.is.startCheckIndustryList('! startCheckIndustryList !');
    MyEmployment = this.is.startCheckEmploymentList('! startCheckEmploymentList !');
    MySchedule = this.is.startCheckScheduleList('! startCheckScheduleList !');
    MyEducation = this.is.startCheckEducationList('! startCheckEducationList !');
    MyExperience = this.is.startCheckExperienceList('! startCheckExperienceList !');

    const city = this.listCity.find(x => x.name === this.editCVForm.controls['inputCity'].value);

    MyCv.SalaryFrom = this.editCVForm.controls['inputSalaryFrom'].value;
    MyCv.Position = this.editCVForm.controls['position'].value;
    MyCv.City = city.id;
    // отрасль
    MyCv.Industry = MyIndustry;
    // график работы
    MyCv.Schedule = MySchedule;
    // занятость
    MyCv.Employment = MyEmployment;
    // образование
    MyCv.Education = MyEducation;
    // опыт работы
    MyCv.Experience = MyExperience;
    // признак удаленного
    MyCv.bInvisible = false;
    return MyCv;
  }

  /* посылаем событие собрать данные, которое одновременно принимает каждый из
     динамических компонентов и запичавает свои данные в плоской переменной  типа Previous, далее они складываются в массив Previous[]
     через вызов setPrevious
     то есть собираем данные из множащихся блоков и возвращаем их в виде единого массива */
  getPreviousData(): Previous[] {
    this.ps.clearPrevious(-1);
    const curPrevious: Previous[] = this.ps.startCheckPrevious(1);
    return curPrevious;

  }

}
