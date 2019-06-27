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
import {AdvancedPrevious, Previous} from '../../../class/Previous';
import {CvListService} from '../../../services/cv-list.service';
import {CV} from '../../../class/CV';
import {AuthService} from '../../../services/auth-service.service';
import {NewcvService} from '../../../services/newcv.service';
import {AdvancedLanguage, Language} from '../../../class/Language';
import {CvLanguageService} from '../../../services/cv-language.service';
import {CvLanguageComponent} from '../cv-language/cv-language.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-cv-edit',
  templateUrl: './cv-edit.component.html',
  styleUrls: ['./cv-edit.component.css']
})
export class CvEditComponent implements OnInit, OnDestroy {

  @ViewChild('spot', {read: ViewContainerRef}) vc;
  factoryPreviousComponent: ComponentFactory<CvPreviousComponent>;

  @ViewChild('spotLanguage', {read: ViewContainerRef}) vcLanguage;
  factoryLanguageComponent: ComponentFactory<CvLanguageComponent>;


  editCVForm: FormGroup;
  listCity: City[] = [];
  index = 0;
  indexLang = 0;
  cv_id = 0;
  private _cvitem: any;
  private _myDisplayCity: string;
  public promPer: string;

  /*  ссылки на созданные компоненты */
  componentsReferences = [];
  componentsLanguageReferences = [];

  // подписки
  private sbCvID: Subscription;
  private cveditCityTable: Subscription;
  private subscrCvEditServ: Subscription;
  private subscrCvEditLanguage: Subscription;
  private sbscrSaveLanguage: Subscription;
  private cvDeleteCv: Subscription;
  private previousPostNewCV: Subscription;
  private previousPostPrevious: Subscription;
  private scrLanguageDelete: Subscription;
  private previousDelete: Subscription;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private is: GuideService,
              private authService: AuthService,
              private router: Router,
              private ps: PreviousService,
              private cveditserv: CvEditService,
              private cls: CvListService,
              private cLangS: CvLanguageService,
              private httpService: NewcvService,
              public translate: TranslateService) {

    this.factoryPreviousComponent =  this.componentFactoryResolver.resolveComponentFactory(CvPreviousComponent);

    this.factoryLanguageComponent =  this.componentFactoryResolver.resolveComponentFactory(CvLanguageComponent);


    this.editCVForm = new FormGroup({
      'inputSalaryFrom': new FormControl('', []),
      'inputExperience': new FormControl('', []),
      'inputEducation': new FormControl('', []),
      'inputSkillsAbilities': new FormControl('', []),
      'inputPosition': new FormControl('', []),
      'inputCity' : new FormControl('', []),
      'industry' : new FormControl('', [])
    });


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
      this.cLangS.onDeleteLanguage.subscribe(
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
      this.editCVForm.controls['inputPosition'].setValue(item.Position);
    }

    // редактируемая "навыки"
    if (typeof item.Skills !== 'undefined') {
      this.editCVForm.controls['inputSkillsAbilities'].setValue(item.Skills);
    }

    // редактируемая "образование"
    if (typeof item.sEducation !== 'undefined') {
      this.editCVForm.controls['inputEducation'].setValue(item.sEducation);
    }

    // редактируемая "опыт"
    if (typeof item.sExperience !== 'undefined') {
      this.editCVForm.controls['inputExperience'].setValue(item.sExperience);

      this.promPer = item.sExperience;

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

    //
    // console.log('отдельно получаем Industry, Employment, Schedule, Experience, Education')

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


    //динамические блоки с предыдущими местами работы
    this.subscrCvEditServ = this.cveditserv.getCvPrevious(this.cv_id).subscribe((value: any) => {

           if (value.length > 0) {
               value.forEach((curPrevious) => {
                     console.log('curPrevious', curPrevious);
                     this.createNewBlock(curPrevious);
                     // this.ps.startLoadPrevious(curPrevious);
             });
            }

    });


    //динамические блоки со знанием языков
    this.subscrCvEditLanguage = this.cveditserv.getCvLanguage(this.cv_id).subscribe((value: any) => {
        console.log('value', value);

      if (value.length>0) {
            value.forEach((curLanguage) => {
              console.log('curLanguage', curLanguage);
              this.createNewLanguageBlock(curLanguage);
            });

      }

    });




  }

  ngOnDestroy() {

    if (typeof this.scrLanguageDelete !== 'undefined') {
      this.scrLanguageDelete.unsubscribe();
    }

    if (typeof this.previousDelete !== 'undefined') {
      this.previousDelete.unsubscribe();
    }

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

    if (typeof  this.sbscrSaveLanguage !== 'undefined') {
      this.sbscrSaveLanguage.unsubscribe();
    }

    if (typeof  this.subscrCvEditLanguage !== 'undefined') {
      this.subscrCvEditLanguage.unsubscribe();
    }
  }


  createNewLanguageBlock(curLanguage: Language) {
    //TODO NEW LANGUAGE BLOCK
    const componentLangRef =  this.vcLanguage.createComponent(this.factoryLanguageComponent);
    componentLangRef.instance.setIndex(++this.indexLang);
    componentLangRef.instance.loadLanguageData(curLanguage);
    this.componentsLanguageReferences.push(componentLangRef);
  }

  createNewBlock(curPrevious: Previous) {
    const componentRef =  this.vc.createComponent(this.factoryPreviousComponent);
    componentRef.instance.setIndex(++this.index);
    componentRef.instance.loaddata(curPrevious);
    this.componentsReferences.push(componentRef);
  }

  savecv() {
      this.updateCvContinue();
  }




  /* сохранение данных */
  updateCvContinue() {

    // получаем изначальные данные без динамических блоков
    let MyCv: CV = this.loadMainCV();
    MyCv.id = this.cv_id;

    if (MyCv.SalaryFrom.toString().trim() === '') MyCv.SalaryFrom = 0;

    console.log('MyCv до=',MyCv);

    return this.previousPostNewCV = this.httpService.postUpdateCV(MyCv).subscribe(
      (value) => {
        // снов аполучаем MyCv.id
        const id = MyCv.id;
        const mPrevious = this.getPreviousData();

        // присваиваем полученный id_cv внутрь каждого блока
        mPrevious.forEach((cPrevious, ih) => {
            cPrevious.id_cv = id;
          });

        const mLanguage = this.getLanguageData();
        // присваиваем полученный id_cv внутрь каждого блока
        mLanguage.forEach((cLanguage, ih) => {
          cLanguage.id_cv = id;
        });

        // записываем массив блоков Previous[] в базу
        let apPrevious = new AdvancedPrevious();
        apPrevious.m  =  mPrevious;
        apPrevious.InsertPrevious = true;
        apPrevious.id_cv = id;

        this.previousPostPrevious = this.httpService.postPrevious(apPrevious).subscribe(
          (value1) => {
            this.saveLanguage(mLanguage, id);
          });
      });
 }

  saveLanguage(mLanguage: Language[], id: number) {
    // записываем массив блоков Language[] в базу


    // записываем массив блоков Previous[] в базу
    let apLanguage = new AdvancedLanguage();
    apLanguage.m  =  mLanguage;
    apLanguage.InsertLanguage = true;
    apLanguage.id_cv = id;

    console.log('apLanguage',apLanguage);

    this.sbscrSaveLanguage = this.httpService.postLanguage(apLanguage).subscribe(
      (value) => {
        console.log('Данные успешно занесены.');
        this.router.navigate(['/cv-list']);
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
    MyCv.Position = this.editCVForm.controls['inputPosition'].value;
    MyCv.City = city.id;
    //опыт словами
    MyCv.sExperience = this.editCVForm.controls['inputExperience'].value;
    //описание умений словами
    MyCv.sSkills = this.editCVForm.controls['inputSkillsAbilities'].value;
    //описание образования словами
    MyCv.sEducation = this.editCVForm.controls['inputEducation'].value;

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

  getLanguageData(): Language[] {
    this.cLangS.clearLanguage(-1);
    const curLanguage: Language[] = this.cLangS.startCheckLanguage(1);
    return curLanguage;
  }


}
