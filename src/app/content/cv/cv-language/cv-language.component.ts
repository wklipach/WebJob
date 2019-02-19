import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Guide} from '../../../class/guide';
import {GuideService} from '../../../services/guide-service.service';
import {CvLanguageService} from '../../../services/cv-language.service';
import {Subscription} from 'rxjs';
import {Language} from '../../../class/Language';
import {LanguageList, LevelLanguageList} from '../../../class/GuideList';

@Component({
  selector: 'app-cv-language',
  templateUrl: './cv-language.component.html',
  styleUrls: ['./cv-language.component.css']
})
export class CvLanguageComponent implements OnInit, OnDestroy {

  formLanguage: FormGroup;
  listLanguage: Guide[] = [];
  listLevelLanguage: Guide[] = [];
  myDisplayLanguage: string = '';
  myDisplayLevelLanguage: string = '';
  public iIndex = 0;
  private sbscrLanguage : Subscription;


  constructor(private is: GuideService, private cls: CvLanguageService) {
    this.formLanguage = new FormGroup({});

    this.listLanguage =  is.getLanguageList();
    if (this.listLanguage.length > 0) this.myDisplayLanguage = this.listLanguage[0].name;
    this.formLanguage.setControl('inputLanguage', new FormControl(this.myDisplayLanguage, []));
    this.listLevelLanguage =  is.getLevelLanguageList();
    if (this.listLevelLanguage.length > 0) this.myDisplayLevelLanguage = this.listLevelLanguage[0].name;
    this.formLanguage.setControl('inputLevelLanguage', new FormControl(this.myDisplayLevelLanguage, []));
    /* возвращаем данные по событию в отбельной переменной. Для каждого блока свое событие, в итоге они суммируются в списке */
    this.sbscrLanguage = this.cls.onCheckLanguage.subscribe((value: number) => {
        this.cls.setLanguage(this.accumulationOfData());
      }
    );
  }

  loadLanguageData(L: Language) {
    if (typeof L.id_level !== 'undefined') {
      const curLevelLanguage = LevelLanguageList.find(Language => Language.id === L.id_level);
      this.formLanguage.controls['inputLevelLanguage'].setValue(curLevelLanguage.name);
    }

    if (typeof L.id_language !== 'undefined') {
      const curLanguage = LanguageList.find(Language => Language.id === L.id_language);
      this.formLanguage.controls['inputLanguage'].setValue(curLanguage.name);
    }
  }


  accumulationOfData(): Language  {
    const t = new Language();
    t.id_cv = -1;
    /* TODO ТУТ ПИШЕМ */
    const curLanguage = LanguageList.find(Language => Language.name === this.formLanguage.controls['inputLanguage'].value);
    t.id_language = curLanguage.id;
    const curLanguageLevel = LevelLanguageList.find(Language => Language.name === this.formLanguage.controls['inputLevelLanguage'].value);
    t.id_level = curLanguageLevel.id;
    return t;
  }


  public getIndex(): number {
    return this.iIndex;
  }

  protected setIndex(i: number) {
    this.iIndex = i;
  }



  ngOnInit() {
  }

  ngOnDestroy() {

    if (typeof this.sbscrLanguage !== 'undefined') {
      this.sbscrLanguage.unsubscribe();
    }

  }

  deleteLanguage() {
    this.cls.startOnDeleteLanguage(this.getIndex());
  }

}
