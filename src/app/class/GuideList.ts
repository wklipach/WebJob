import {Guide} from './guide';
import {Component, OnDestroy, OnInit} from '@angular/core';


 export class  staticGuideList {

  //вакансии
   private static _vac1 = '';
   public static set all_vac1(value) {
     this._vac1 = value;
   }
   public static get vac1(): string {
     return this._vac1;
   }

   //пол мужской-женский
   private static _GenderList_val2 = '';
   private static _GenderList_val3 = '';

   public static set GenderList_val2(value) {
     this._GenderList_val2 = value;
   }

   public static set GenderList_val3(value) {
     this._GenderList_val3 = value;
   }

   public static get GenderList(): Guide[] {
     return [
       {id: 1, order: 1, name: '', comment: ''},
       {id: 2, order: 2, name: this._GenderList_val2, comment: ''},
       {id: 3, order: 3, name: this._GenderList_val3, comment: ''}
     ];
   }

   private static _Education_val1: string = '';
   private static _Education_val2: string = '';
   private static _Education_val3: string = '';
   private static _Education_val4: string = '';
   private static _Education_val5: string = '';
   private static _Education_val6: string = '';
   private static _Education_val7: string = '';


   public static set Education_val1(value) {
     this._Education_val1 = value;
   }

   public static set Education_val2(value) {
     this._Education_val2 = value;
   }

   public static set Education_val3(value) {
     this._Education_val3 = value;
   }

   public static set Education_val4(value) {
     this._Education_val4 = value;
   }

   public static set Education_val5(value) {
     this._Education_val5 = value;
   }

   public static set Education_val6(value) {
     this._Education_val6 = value;
   }

   public static set Education_val7(value) {
     this._Education_val7 = value;
   }


// образование
   public static get EducationList(): Guide[] {
     return [
       {id: 1, order: 1, name: this._Education_val1, comment: ''},
       {id: 2, order: 2, name: this._Education_val2, comment: ''},
       {id: 3, order: 3, name: this._Education_val3, comment: ''},
       {id: 4, order: 4, name: this._Education_val4, comment: ''},
       {id: 5, order: 5, name: this._Education_val5, comment: ''},
       {id: 6, order: 6, name: this._Education_val6, comment: ''} ,
       {id: 7, order: 7, name: this._Education_val7, comment: ''}
     ];
   }

//языки
   private static _LanguageList_val2: string = '';
   private static _LanguageList_val3: string = '';
   private static _LanguageList_val4: string = '';
   private static _LanguageList_val5: string = '';
   private static _LanguageList_val6: string = '';
   private static _LanguageList_val7: string = '';
   private static _LanguageList_val8: string = '';
   private static _LanguageList_val9: string = '';
   private static _LanguageList_val10: string = '';
   private static _LanguageList_val11: string = '';
   private static _LanguageList_val12: string = '';
   private static _LanguageList_val13: string = '';

   public static set LanguageList_val2(value) {
     this._LanguageList_val2 = value;
   }

   public static set LanguageList_val3(value) {
     this._LanguageList_val3 = value;
   }

   public static set LanguageList_val4(value) {
     this._LanguageList_val4 = value;
   }

   public static set LanguageList_val5(value) {
     this._LanguageList_val5 = value;
   }

   public static set LanguageList_val6(value) {
     this._LanguageList_val6 = value;
   }

   public static set LanguageList_val7(value) {
     this._LanguageList_val7 = value;
   }

   public static set LanguageList_val8(value) {
     this._LanguageList_val8 = value;
   }

   public static set LanguageList_val9(value) {
     this._LanguageList_val9 = value;
   }

   public static set LanguageList_val10(value) {
     this._LanguageList_val10 = value;
   }

   public static set LanguageList_val11(value) {
     this._LanguageList_val11 = value;
   }

   public static set LanguageList_val12(value) {
     this._LanguageList_val12 = value;
   }

   public static set LanguageList_val13(value) {
     this._LanguageList_val13 = value;
   }

   public static get LanguageList(): Guide[] {
     return [
       {id: 1, order: 1, name: '', comment: ''},
       {id: 2, order: 2, name: this._LanguageList_val2, comment: ''},
       {id: 3, order: 3, name: this._LanguageList_val3, comment: ''},
       {id: 4, order: 4, name: this._LanguageList_val4, comment: ''},
       {id: 5, order: 5, name: this._LanguageList_val5, comment: ''},
       {id: 6, order: 6, name: this._LanguageList_val6, comment: ''},
       {id: 7, order: 7, name: this._LanguageList_val7, comment: ''},
       {id: 8, order: 8, name: this._LanguageList_val8, comment: ''},
       {id: 9, order: 9, name: this._LanguageList_val9, comment: ''},
       {id: 10, order: 10, name: this._LanguageList_val10, comment: ''},
       {id: 11, order: 11, name: this._LanguageList_val11, comment: ''},
       {id: 12, order: 12, name: this._LanguageList_val12, comment: ''},
       {id: 13, order: 13, name: this._LanguageList_val13, comment: ''}
     ]
   };

   //уровень владения
   private static _LevelLanguage_val2: string = '';
   private static _LevelLanguage_val3: string = '';
   private static _LevelLanguage_val4: string = '';
   private static _LevelLanguage_val5: string = '';
   private static _LevelLanguage_val6: string = '';
   private static _LevelLanguage_val7: string = '';
   private static _LevelLanguage_val8: string = '';
   public static set LevelLanguage_val2(value) {this._LevelLanguage_val2 = value;}
   public static set LevelLanguage_val3(value) {this._LevelLanguage_val3 = value;}
   public static set LevelLanguage_val4(value) {this._LevelLanguage_val4 = value;}
   public static set LevelLanguage_val5(value) {this._LevelLanguage_val5 = value;}
   public static set LevelLanguage_val6(value) {this._LevelLanguage_val6 = value;}
   public static set LevelLanguage_val7(value) {this._LevelLanguage_val7 = value;}
   public static set LevelLanguage_val8(value) {this._LevelLanguage_val8 = value;}


   public static get LevelLanguageList(): Guide[] {
     return [
       {id: 1, order: 1, name: '', comment: ''},
       {id: 2, order: 2, name: this._LevelLanguage_val2, comment: ''},
       {id: 3, order: 3, name: this._LevelLanguage_val3, comment: ''},
       {id: 4, order: 4, name: this._LevelLanguage_val4, comment: ''},
       {id: 5, order: 5, name: this._LevelLanguage_val5, comment: ''},
       {id: 6, order: 6, name: this._LevelLanguage_val6, comment: ''},
       {id: 7, order: 7, name: this._LevelLanguage_val7, comment: ''},
       {id: 8, order: 8, name: this._LevelLanguage_val8, comment: ''},
     ]
   };


   private static _Industry_val2: string = '';
   private static _Industry_val1: string = '';
   private static _Industry_val3: string = '';
   private static _Industry_val4: string = '';
   private static _Industry_val5: string = '';
   private static _Industry_val6: string = '';
   private static _Industry_val7: string = '';
   private static _Industry_val8: string = '';
   private static _Industry_val9: string = '';
   private static _Industry_val10: string = '';
   private static _Industry_val11: string = '';
   private static _Industry_val12: string = '';
   private static _Industry_val13: string = '';
   private static _Industry_val14: string = '';
   private static _Industry_val15: string = '';
   private static _Industry_val16: string = '';
   private static _Industry_val17: string = '';
   private static _Industry_val18: string = '';
   private static _Industry_val19: string = '';
   private static _Industry_val20: string = '';
   private static _Industry_val21: string = '';
   private static _Industry_val22: string = '';
   private static _Industry_val23: string = '';
   private static _Industry_val24: string = '';
   private static _Industry_val25: string = '';
   private static _Industry_val26: string = '';
   private static _Industry_val27: string = '';
   private static _Industry_val28: string = '';
   private static _Industry_val29: string = '';
   private static _Industry_val30: string = '';


   public static set Industry_val2(value) {this._Industry_val2 = value;}
   public static set Industry_val1(value) {this._Industry_val1 = value;}
   public static set Industry_val3(value) {this._Industry_val3 = value;}
   public static set Industry_val4(value) {this._Industry_val4 = value;}
   public static set Industry_val5(value) {this._Industry_val5 = value;}
   public static set Industry_val6(value) {this._Industry_val6 = value;}
   public static set Industry_val7(value) {this._Industry_val7 = value;}
   public static set Industry_val8(value) {this._Industry_val8 = value;}
   public static set Industry_val9(value) {this._Industry_val9 = value;}
   public static set Industry_val10(value) {this._Industry_val10 = value;}
   public static set Industry_val11(value) {this._Industry_val11 = value;}
   public static set Industry_val12(value) {this._Industry_val12 = value;}
   public static set Industry_val13(value) {this._Industry_val13 = value;}
   public static set Industry_val14(value) {this._Industry_val14 = value;}
   public static set Industry_val15(value) {this._Industry_val15 = value;}
   public static set Industry_val16(value) {this._Industry_val16 = value;}
   public static set Industry_val17(value) {this._Industry_val17 = value;}
   public static set Industry_val18(value) {this._Industry_val18 = value;}
   public static set Industry_val19(value) {this._Industry_val19 = value;}
   public static set Industry_val20(value) {this._Industry_val20 = value;}
   public static set Industry_val21(value) {this._Industry_val21 = value;}
   public static set Industry_val22(value) {this._Industry_val22 = value;}
   public static set Industry_val23(value) {this._Industry_val23 = value;}
   public static set Industry_val24(value) {this._Industry_val24 = value;}
   public static set Industry_val25(value) {this._Industry_val25 = value;}
   public static set Industry_val26(value) {this._Industry_val26 = value;}
   public static set Industry_val27(value) {this._Industry_val27 = value;}
   public static set Industry_val28(value) {this._Industry_val28 = value;}
   public static set Industry_val29(value) {this._Industry_val29 = value;}
   public static set Industry_val30(value) {this._Industry_val30 = value;}




   public static get IndustryList(): Guide[] {
   return [
      { id: 2, order: 2, name: this._Industry_val2,  comment: '' },
      { id: 1, order: 1, name: this._Industry_val1,  comment: '' },
      { id: 3, order: 3, name: this._Industry_val3,  comment: '' },
      { id: 4, order: 4, name: this._Industry_val4,  comment: '' },
      { id: 5, order: 5, name: this._Industry_val5,  comment: '' },
      { id: 6, order: 6, name: this._Industry_val6,  comment: '' },
      { id: 7, order: 7, name: this._Industry_val7,  comment: '' },
      { id: 8, order: 8, name: this._Industry_val8,  comment: '' },
      { id: 9, order: 9, name: this._Industry_val9,  comment: '' },
      { id: 10, order: 10, name: this._Industry_val10,  comment: '' },
      { id: 11, order: 11, name: this._Industry_val11,  comment: ''},
      { id: 12, order: 12, name: this._Industry_val12,  comment: ''},
      { id: 13, order: 13, name: this._Industry_val13,  comment: ''},
      { id: 14, order: 14, name: this._Industry_val14,  comment: ''},
      { id: 15, order: 15, name: this._Industry_val15,  comment: ''},
      { id: 16, order: 16, name: this._Industry_val16,  comment: ''},
      { id: 17, order: 17, name: this._Industry_val17,  comment: ''},
      { id: 18, order: 18, name: this._Industry_val18,  comment: ''},
      { id: 19, order: 19, name: this._Industry_val19,  comment: ''},
      { id: 20, order: 20, name: this._Industry_val20,  comment: ''},
      { id: 21, order: 21, name: this._Industry_val21,  comment: ''},
      { id: 22, order: 22, name: this._Industry_val22,  comment: ''},
      { id: 23, order: 23, name: this._Industry_val23,  comment: ''},
      { id: 24, order: 24, name: this._Industry_val24,  comment: ''},
      { id: 25, order: 25, name: this._Industry_val25,  comment: ''},
      { id: 26, order: 26, name: this._Industry_val26,  comment: ''},
      { id: 27, order: 27, name: this._Industry_val27,  comment: ''},
      { id: 28, order: 28, name: this._Industry_val28,  comment: ''},
      { id: 29, order: 29, name: this._Industry_val29,  comment: ''},
      { id: 30, order: 30, name: this._Industry_val30,  comment: ''}
];}


   private static _DisplayPeriod_val1: string = '';
   private static _DisplayPeriod_val2: string = '';
   private static _DisplayPeriod_val3: string = '';
   private static _DisplayPeriod_val4: string = '';
   public static set DisplayPeriod_val1(value) {this._DisplayPeriod_val1 = value;}
   public static set DisplayPeriod_val2(value) {this._DisplayPeriod_val2 = value;}
   public static set DisplayPeriod_val3(value) {this._DisplayPeriod_val3 = value;}
   public static set DisplayPeriod_val4(value) {this._DisplayPeriod_val4 = value;}

   public static get DisplayPeriodList(): Guide[] {
     return [
     { id: 1, order: 1, name: this._DisplayPeriod_val1,  comment: '' },
     { id: 2, order: 2, name: this._DisplayPeriod_val2,  comment: '' },
     { id: 3, order: 3, name: this._DisplayPeriod_val3,  comment: '' },
     { id: 4, order: 4, name: this._DisplayPeriod_val4,  comment: '' }
   ];
   }

   // график работы
   private static _Schedule_val1: string = '';
   private static _Schedule_val2: string = '';
   private static _Schedule_val3: string = '';
   private static _Schedule_val4: string = '';
   private static _Schedule_val5: string = '';
   public static set Schedule_val1(value) {this._Schedule_val1 = value;}
   public static set Schedule_val2(value) {this._Schedule_val2 = value;}
   public static set Schedule_val3(value) {this._Schedule_val3 = value;}
   public static set Schedule_val4(value) {this._Schedule_val4 = value;}
   public static set Schedule_val5(value) {this._Schedule_val5 = value;}

   public static get ScheduleList(): Guide[] {
     return [
     { id: 1, order: 1, name: this._Schedule_val1,  comment: '' },
     { id: 2, order: 2, name: this._Schedule_val2,  comment: '' },
     { id: 3, order: 3, name: this._Schedule_val3,  comment: '' },
     { id: 4, order: 4, name: this._Schedule_val4,  comment: '' },
     { id: 5, order: 5, name: this._Schedule_val5,  comment: '' }
   ];}

// занятость
   private static _Employment_val1: string = '';
   private static _Employment_val2: string = '';
   private static _Employment_val3: string = '';
   private static _Employment_val4: string = '';
   private static _Employment_val5: string = '';
   private static _Employment_val6: string = '';

   public static set Employment_val1(value) {this._Employment_val1 = value;}
   public static set Employment_val2(value) {this._Employment_val2 = value;}
   public static set Employment_val3(value) {this._Employment_val3 = value;}
   public static set Employment_val4(value) {this._Employment_val4 = value;}
   public static set Employment_val5(value) {this._Employment_val5 = value;}
   public static set Employment_val6(value) {this._Employment_val6 = value;}

   public static get EmploymentList(): Guide[] {
     return [
     { id: 1, order: 1, name: this._Employment_val1,  comment: '' },
     { id: 2, order: 2, name: this._Employment_val2,  comment: '' },
     { id: 3, order: 3, name: this._Employment_val3,  comment: '' },
     { id: 4, order: 4, name: this._Employment_val4,  comment: '' },
     { id: 5, order: 5, name: this._Employment_val5,  comment: '' },
     { id: 6, order: 6, name: this._Employment_val6,  comment: '' }
   ];}

//опыт работы
   private static _Experience_val1: string = '';
   private static _Experience_val2: string = '';
   private static _Experience_val3: string = '';
   private static _Experience_val4: string = '';
   public static set Experience_val1(value) {this._Experience_val1 = value;}
   public static set Experience_val2(value) {this._Experience_val2 = value;}
   public static set Experience_val3(value) {this._Experience_val3 = value;}
   public static set Experience_val4(value) {this._Experience_val4 = value;}

   public static get ExperienceList(): Guide[] {
     return [
     { id: 1, order: 1, name: this._Experience_val1,  comment: '' },
     { id: 2, order: 2, name: this._Experience_val2,  comment: '' },
     { id: 3, order: 3, name: this._Experience_val3,  comment: '' },
     { id: 4, order: 4, name: this._Experience_val4,  comment: '' }
   ];}

//срок размещения
   private static _TimePlacement_val1: string = '';
   private static _TimePlacement_val2: string = '';
   private static _TimePlacement_val3: string = '';
   private static _TimePlacement_val4: string = '';
   private static _TimePlacement_val5: string = '';
   public static set TimePlacement_val1(value) {this._TimePlacement_val1 = value;}
   public static set TimePlacement_val2(value) {this._TimePlacement_val2 = value;}
   public static set TimePlacement_val3(value) {this._TimePlacement_val3 = value;}
   public static set TimePlacement_val4(value) {this._TimePlacement_val4 = value;}
   public static set TimePlacement_val5(value) {this._TimePlacement_val5 = value;}

   public static get TimePlacementList(): Guide[] {
     return [
       { id: 1, order: 1, name: this._TimePlacement_val1,  comment: '1 WEEK' },
       { id: 2, order: 2, name: this._TimePlacement_val2,  comment: '2 WEEK' },
       { id: 3, order: 3, name: this._TimePlacement_val3,  comment: '1 MONTH' },
       { id: 4, order: 4, name: this._TimePlacement_val4,  comment: '2 MONTH' },
       { id: 5, order: 5, name: this._TimePlacement_val5,  comment: '3 MONTH' },
     ];}
 }










