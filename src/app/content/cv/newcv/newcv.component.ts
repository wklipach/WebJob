import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {City} from '../../../class/City';
import {GuideService} from '../../../services/guide-service.service';
import {CvPreviousComponent} from '../cv-previous/cv-previous.component';
import {ComponentFactory} from '@angular/core/src/linker/component_factory';
import {Previous} from '../../../class/Previous';
import {PreviousService} from '../../../services/previous.service';
import {Subscription} from 'rxjs';
import {CV} from '../../../class/CV';
import {NewcvService} from '../../../services/newcv.service';
import {AuthService} from '../../../services/auth-service.service';
import {Router} from '@angular/router';
import {CvLanguageComponent} from '../cv-language/cv-language.component';
import {CvLanguageService} from '../../../services/cv-language.service';
import {Language} from '../../../class/Language';

@Component({
  selector: 'app-newcv',
  templateUrl: './newcv.component.html',
  styleUrls: ['./newcv.component.css']
})
export class NewcvComponent implements OnInit {

  @ViewChild('spot', {read: ViewContainerRef}) vc;
  factoryPreviousComponent: ComponentFactory<CvPreviousComponent>;


  @ViewChild('spotLanguage', {read: ViewContainerRef}) vcLanguage;
  factoryLanguageComponent: ComponentFactory<CvLanguageComponent>;

  private previousCityTable: Subscription;
  private previousDelete: Subscription;
  private scrLanguageDelete: Subscription;
  private previousPostPrevious: Subscription;
  private sbscrSaveLanguage: Subscription;
  private previousPostNewCV: Subscription;

  newCVForm: FormGroup;
  listCity: City[] = [];
  myDisplayCity: string = "";
  index: number = 0;

  /*  ссылки на созданные компоненты */
  componentsReferences = [];
  componentsLanguageReferences = [];

  constructor(private is: GuideService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private ps: PreviousService,
              private cls: CvLanguageService,
              private httpService: NewcvService,
              private authService: AuthService,
              private router: Router) {


    this.newCVForm = new FormGroup({
      'inputSalaryFrom': new FormControl('',[]),
      'inputPosition': new FormControl('',[]),
      'inputCity' : new FormControl('',[]),
      'inputSkillsAbilities' : new FormControl('',[Validators.maxLength(1000)]),
      'inputExperience': new FormControl('',[Validators.maxLength(1000)])
    });

    this.previousCityTable =  is.getCityTable().subscribe(
      (data: City[]) => {
        this.listCity = data;
        if (this.listCity.length > 0) this.myDisplayCity = this.listCity[0].name;
        this.newCVForm.setControl('inputCity', new FormControl(this.myDisplayCity, []));
      }
    );

    this.factoryPreviousComponent =  this.componentFactoryResolver.resolveComponentFactory(CvPreviousComponent);


    console.log('aa1');
    this.factoryLanguageComponent =  this.componentFactoryResolver.resolveComponentFactory(CvLanguageComponent);
    console.log('aa2');


    /* подписка на удаление блока "предыдущее место работы" */
    this.previousDelete =
      this.ps.onDeletePrevious.subscribe(
        (value: number) => {
          if (this.vc.length < 1) return;
          let componentRef = this.componentsReferences.filter(x => x.instance.getIndex() === value)[0];
          let vcrIndex: number = this.vc.indexOf(componentRef)
          // removing component from container
          this.vc.remove(vcrIndex);
      }
    );

    /* подписка на удаление блока "знание языков" */
    this.scrLanguageDelete =
      this.cls.onDeleteLanguage.subscribe(
        (value: number) => {
          if (this.vcLanguage.length < 1) return;
          const componentLanguageRef = this.componentsLanguageReferences.filter(x => x.instance.getIndex() === value)[0];
          const vcrLangIndex: number = this.vcLanguage.indexOf(componentLanguageRef)
          // removing component from container
          this.vcLanguage.remove(vcrLangIndex);
        }
      );


  }

  ngOnInit() {
  }

  submit() {
    console.log('submit');

  }

  createNewBlock() {
    const componentRef =  this.vc.createComponent(this.factoryPreviousComponent);
    componentRef.instance.setIndex(++this.index);
    this.componentsReferences.push(componentRef);
  }

  createNewLanguageBlock() {
    const componentLanguageRef =  this.vcLanguage.createComponent(this.factoryLanguageComponent);
    componentLanguageRef.instance.setIndex(++this.index);
    this.componentsLanguageReferences.push(componentLanguageRef);
  }


  ngOnDestroy() {
    if (typeof this.previousCityTable !== 'undefined') {
      this.previousCityTable.unsubscribe();
    }

    if (typeof this.previousDelete !== 'undefined') {
      this.previousDelete.unsubscribe();
    }

    if (typeof this.previousPostNewCV !== 'undefined') {
      this.previousPostNewCV.unsubscribe();
    }

    if (typeof this.previousPostPrevious !== 'undefined') {
      this.previousPostPrevious.unsubscribe();
    }

    if (typeof this.scrLanguageDelete !== 'undefined') {
      this.scrLanguageDelete.unsubscribe();
    }

    if (typeof this.sbscrSaveLanguage !== 'undefined') {
      this.sbscrSaveLanguage.unsubscribe();
    }

  }


  /* сохраняем резюме без динамических блоков, возвращаем номер сохраненного резюме */
  loadMainCV(): CV {
    let MyCv: CV = new CV();
    let MyIndustry: number[];
    let MySchedule: number[];
    let MyEmployment: number[];
    let MyEducation: number[];
    let MyExperience: number[];


    var Res =  this.authService.loginStorage();
    if (Res.bConnected) MyCv.id_user = Res.id_user; else MyCv.id_user = -1;


    MyIndustry = this.is.startCheckIndustryList('! startCheckIndustryList !');
    MyEmployment= this.is.startCheckEmploymentList('! startCheckEmploymentList !');
    MySchedule= this.is.startCheckScheduleList('! startCheckScheduleList !');
    MyEducation = this.is.startCheckEducationList('! startCheckEducationList !');
    MyExperience = this.is.startCheckExperienceList('! startCheckExperienceList !');

    let city = this.listCity.find(x=>x.name===this.newCVForm.controls['inputCity'].value);


    MyCv.sExperience = this.newCVForm.controls['inputExperience'].value;
    MyCv.SalaryFrom = this.newCVForm.controls['inputSalaryFrom'].value;
    MyCv.Position = this.newCVForm.controls['inputPosition'].value;
    MyCv.City = city.id;
    // отрасль
    MyCv.Industry = MyIndustry;
    // график работы
    MyCv.Schedule = MySchedule;
    // занятость
    MyCv.Employment = MyEmployment;
    // образование
    MyCv.Education = MyEducation;
    //опыт работы
    MyCv.Experience = MyExperience;
    // признак удаленного
    MyCv.bInvisible = false;
    return MyCv
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


  /* посылаем событие собрать данные, которое одновременно принимает каждый из
     динамических компонентов Language и запиcsвает свои данные в плоской переменной  типа Language, далее они складываются в массив Language[]
     через вызов setLanguage
     то есть собираем данные из множащихся блоков и возвращаем их в виде единого массива */
  getLanguageData(): Language[] {
    this.cls.clearLanguage(-1);
    const curLanguage: Language[] = this.cls.startCheckLanguage(1);
    return curLanguage;

  }

chf() {
  let mLanguage = this.getLanguageData();
  console.log('mLanguage',mLanguage);
  let mPrevious = this.getPreviousData();
  console.log('mPrevious',mPrevious);
}

  /* сохранение данных */
  newcv() {

    // получаем изначальные данные без динамических блоков
    let MyCv: CV = this.loadMainCV();
    return this.previousPostNewCV =this.httpService.postNewCV(MyCv).subscribe(
      (value) => {
        // из возвращенного результата забираем новое ID
        let id = value['id'];
        const mPrevious = this.getPreviousData();
        const mLanguage = this.getLanguageData();
        // присваиваем полученный id_cv внутрь каждого блока
        mPrevious.forEach((cPrevious, ih) => {
          cPrevious.id_cv = id;
         // console.log('cPrevious=',cPrevious);
          }
        );

        // присваиваем полученный id_cv внутрь каждого блока
        mLanguage.forEach((cLanguage, ih) => {
          cLanguage.id_cv = id;
          // console.log('cPrevious=',cPrevious);
        });

        // записываем массив блоков Previous[] в базу
        this.previousPostPrevious =this.httpService.postPrevious(mPrevious).subscribe(
          (value) => {
            this.saveLanguage(mLanguage);
            }
        );
      });
  }



  saveLanguage(mLanguage: Language[]) {
    // записываем массив блоков Language[] в базу
    this.sbscrSaveLanguage = this.httpService.postLanguage(mLanguage).subscribe(
      (value) => {
        console.log('Данные успешно занесены.');
        this.router.navigate(['/cv-list']);
      }
    );
  }



}


