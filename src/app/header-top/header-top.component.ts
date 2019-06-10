import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {TableVacancyService} from '../services/table-vacancy.service';
import {MoveService} from '../services/move.service';
import {LetterService} from '../services/letter.service';
import {TranslateService} from '@ngx-translate/core';
import {
  staticGuideList
} from '../class/GuideList';

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.css']
})
export class HeaderTopComponent implements OnInit {

  headerTopForm : FormGroup;
  htUserName = '';
  bConnected = false;
  sElementMask: string = '';
  id_user: number;
  bEmployer : boolean;
  numberCountNotReadLetter: number = 0;
  numberCountNotReadBell: number = 0;

  protected currentLangSwitch: number = 1;
  private arrLangs: any = ['ru', 'et', 'en'];

  sNullValueFind : string = '';

  constructor(private httpService: AuthService, private router: Router,
                      private httpTvsService: TableVacancyService, private moveS: MoveService,
                      private curRoute: ActivatedRoute, private letServ: LetterService,
                      public translate: TranslateService
                      ) {


    translate.addLangs(this.arrLangs);
    translate.setDefaultLang('et');
    const browserLang = translate.getDefaultLang();
    this.currentLangSwitch = this.httpService.getLangStorage();
    translate.use(this.arrLangs[this.currentLangSwitch]);
    //translate.use(browserLang.match(/ru|ee|en/) ? browserLang : 'ee');
    console.log('home.value1');
    this.translate.get('home.value1').subscribe(
      value => console.log(value)
    );

    this.loadStaticGuide();


    this.headerTopForm = new FormGroup({
      'inputSearch': new FormControl('',[])
    });


    this.moveS.onNullFind.subscribe((value) => {
      console.log('event onNullFind', value);
      this.sNullValueFind = value;
      this.headerTopForm.controls['inputSearch'].setValue('');
    });


    this.httpService.IsUserLoggedIn.subscribe(value => {
      this.htUserName = value.name;
      this.bConnected = value.connect;
      this.id_user = value.id_user;
      this.bEmployer = value.bEmployer;
      // console.log('this.htUserName =', this.htUserName);
    });


  }

  myClickLang (item: number) {
    console.log(item);
    this.currentLangSwitch = item;
    this.httpService.setLangStorage(this.currentLangSwitch);
    this.translate.use(this.arrLangs[this.currentLangSwitch]);
    this.loadStaticGuide();
    this.RouterReload();



  }


  ngOnInit() {



    var Res =  this.httpService.loginStorage();
    this.htUserName = Res.htUserName;
    this.bConnected = Res.bConnected;
    this.id_user =  Res.id_user;
    this.bEmployer =  Res.bEmployer;



    //console.log('ht1',this.id_user);

    this.sElementMask  = this.moveS.getStringFind();


    this.sNullValueFind = this.moveS.getNullValueFind();

    // обнуляем сервис после вывода предупреждающего сообщения об неуспешном поиске
    this.moveS.setNullValueFind('');

    this.countNotReadLetter();

    this.countCountNotReadBell();

  }

  //numberCountNotReadBell
  countCountNotReadBell() {
    if (this.bConnected) {
      //TODO подсчет количества непрочитанных писем

        this.letServ.getCountNotReadBell(this.id_user).subscribe(
          (value: any[]) => {


            if (value !== null) {
              console.log('Bell value.length', value.length, 'this.id_user', this.id_user);
              this.numberCountNotReadBell = value.length;
            }
          }
        );
    } else
      this.numberCountNotReadBell = -1;
  }

  countNotReadLetter() {
    if (this.bConnected) {
          //TODO подсчет количества непрочитанных писем

      console.log('header-top component countNotReadLetter()!');

      this.letServ.getCountNotReadLetter(this.id_user).subscribe(
        (value: any[]) => {

          if (value !== null) this.numberCountNotReadLetter = value.length; else this.numberCountNotReadLetter = -1;
        }
      )} else
      this.numberCountNotReadLetter = -1;
  }

  logout() {

    window.localStorage.removeItem('htUserName');
    window.localStorage.removeItem('bConnected');
    window.localStorage.removeItem('bEmployer');
    window.localStorage.removeItem('id_user');
    this.httpService.IsUserLoggedIn.next({connect : false, name : '', id_user: -1, bEmployer: false});
    this.router.navigate(['/']);
  }






  favorites() {
    // TODO ПОКАЗ ФАВОРИТов 2

    console.log('FAVORITS');

    this.httpTvsService.getFavoritesVacancy(this.id_user).subscribe((favor) =>{
      let s='?&id=-1'; //-1 чтобы иметь пустой курсор в случае отсутствия избранных
      for (let curFavor in favor) {
        s=s+'&id='+favor[curFavor].id_vc;
      }
      window.localStorage.setItem('stringFavorites', s);
      this.getVacancy('',true, false);
    });

  }


  clearfind() {
     this.getVacancy('', false, false);

//    window.localStorage.removeItem('keyFind');
//    this.router.navigate(['/home']);



  }

//TODO FindComponent
  find() {
    console.log('нажали обычный поиск');
    const sInputSearch = this.headerTopForm.controls['inputSearch'].value;

    if (this.bConnected && this.bEmployer) {
      console.log('нажали обычный поиск getCV');
      this.getCV(sInputSearch, false, false);
    } else {
      console.log('нажали обычный поиск getVacancy');
      this.getVacancy(sInputSearch, false, false);
    }

  } //find()


  //
  // запускаем триггер события
  //
  getVacancy(sMask: string,isFavorites: boolean, isAdvancedFind: boolean) {
    this.sNullValueFind = '';
    window.localStorage.setItem('backPage', this.router.url);
    // если домашняя страница запускаем событие, если нет переходим на нее и маску передаем через Экстракт
    // событие инициализируется фактом запуска компонента Home и наличием маски
    if ( (this.router.isActive('smain',true)===false)  && (this.router.isActive('',true) ===false)  ) {
      window.localStorage.setItem('keyFind', sMask);
      this.router.navigate(['/']);
     } else {
      window.localStorage.removeItem('keyFind');
      this.httpTvsService.triggerReopenVacancy({sMask, isFavorites, isAdvancedFind});
    }
  }

  getCV(sMask: string,isFavorites: boolean, isAdvancedFind: boolean) {

    this.sNullValueFind = '';
    window.localStorage.setItem('backPage', this.router.url);
    // если домашняя страница запускаем событие, если нет переходим на нее и маску передаем через Экстракт
    // событие инициализируется фактом запуска компонента Home и наличием маски
    if ( (this.router.isActive('smain',true)===false)  && (this.router.isActive('',true) ===false)  ) {
      window.localStorage.setItem('keyFind', sMask);
      console.log('hetCV input1')
      this.router.navigate(['/']);
    } else {
      window.localStorage.removeItem('keyFind');
      this.httpTvsService.triggerReopenCV({sMask, isFavorites, isAdvancedFind});
    }

  }

  toAdvance() {
    this.router.navigate(['/advanced-search']);
  }


  RouterReload() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.navigated = false;

    this.router.navigate([this.router.url]);
  }

  loadStaticGuide() {

    this.translate.get('staticGuideList.GenderList_val2').subscribe(value => staticGuideList.GenderList_val2 = value);
    this.translate.get('staticGuideList.GenderList_val3').subscribe(value => staticGuideList.GenderList_val3 = value);

    this.translate.get('staticGuideList.Education_val1').subscribe(value => staticGuideList.Education_val1 = value);
    this.translate.get('staticGuideList.Education_val2').subscribe(value => staticGuideList.Education_val2 = value);
    this.translate.get('staticGuideList.Education_val3').subscribe(value => staticGuideList.Education_val3 = value);
    this.translate.get('staticGuideList.Education_val4').subscribe(value => staticGuideList.Education_val4 = value);
    this.translate.get('staticGuideList.Education_val5').subscribe(value => staticGuideList.Education_val5 = value);

    this.translate.get('staticGuideList.LanguageList_val2').subscribe(value => staticGuideList.LanguageList_val2 = value);
    this.translate.get('staticGuideList.LanguageList_val3').subscribe(value => staticGuideList.LanguageList_val3 = value);
    this.translate.get('staticGuideList.LanguageList_val4').subscribe(value => staticGuideList.LanguageList_val4 = value);
    this.translate.get('staticGuideList.LanguageList_val5').subscribe(value => staticGuideList.LanguageList_val5 = value);
    this.translate.get('staticGuideList.LanguageList_val6').subscribe(value => staticGuideList.LanguageList_val6 = value);
    this.translate.get('staticGuideList.LanguageList_val7').subscribe(value => staticGuideList.LanguageList_val7 = value);
    this.translate.get('staticGuideList.LanguageList_val8').subscribe(value => staticGuideList.LanguageList_val8 = value);
    this.translate.get('staticGuideList.LanguageList_val9').subscribe(value => staticGuideList.LanguageList_val9 = value);
    this.translate.get('staticGuideList.LanguageList_val10').subscribe(value => staticGuideList.LanguageList_val10 = value);
    this.translate.get('staticGuideList.LanguageList_val11').subscribe(value => staticGuideList.LanguageList_val11 = value);
    this.translate.get('staticGuideList.LanguageList_val12').subscribe(value => staticGuideList.LanguageList_val12 = value);
    this.translate.get('staticGuideList.LanguageList_val13').subscribe(value => staticGuideList.LanguageList_val13 = value);

    this.translate.get('staticGuideList.LevelLanguage_val2').subscribe(value => staticGuideList.LevelLanguage_val2 = value);
    this.translate.get('staticGuideList.LevelLanguage_val3').subscribe(value => staticGuideList.LevelLanguage_val3 = value);
    this.translate.get('staticGuideList.LevelLanguage_val4').subscribe(value => staticGuideList.LevelLanguage_val4 = value);
    this.translate.get('staticGuideList.LevelLanguage_val5').subscribe(value => staticGuideList.LevelLanguage_val5 = value);
    this.translate.get('staticGuideList.LevelLanguage_val6').subscribe(value => staticGuideList.LevelLanguage_val6 = value);
    this.translate.get('staticGuideList.LevelLanguage_val7').subscribe(value => staticGuideList.LevelLanguage_val7 = value);
    this.translate.get('staticGuideList.LevelLanguage_val8').subscribe(value => staticGuideList.LevelLanguage_val8 = value);

    this.translate.get('staticGuideList.Industry_val2').subscribe(value => {
        staticGuideList.Industry_val2 = value;
        console.log('staticGuideList.Industry_val',  value, staticGuideList.IndustryList);

      });
    this.translate.get('staticGuideList.Industry_val1').subscribe(value => staticGuideList.Industry_val1 = value);
    this.translate.get('staticGuideList.Industry_val2').subscribe(value => staticGuideList.Industry_val2 = value);
    this.translate.get('staticGuideList.Industry_val3').subscribe(value => staticGuideList.Industry_val3 = value);
    this.translate.get('staticGuideList.Industry_val4').subscribe(value => staticGuideList.Industry_val4 = value);
    this.translate.get('staticGuideList.Industry_val5').subscribe(value => staticGuideList.Industry_val5 = value);
    this.translate.get('staticGuideList.Industry_val6').subscribe(value => staticGuideList.Industry_val6 = value);
    this.translate.get('staticGuideList.Industry_val7').subscribe(value => staticGuideList.Industry_val7 = value);
    this.translate.get('staticGuideList.Industry_val8').subscribe(value => staticGuideList.Industry_val8 = value);
    this.translate.get('staticGuideList.Industry_val9').subscribe(value => staticGuideList.Industry_val9 = value);
    this.translate.get('staticGuideList.Industry_val10').subscribe(value => staticGuideList.Industry_val10 = value);
    this.translate.get('staticGuideList.Industry_val11').subscribe(value => staticGuideList.Industry_val11 = value);
    this.translate.get('staticGuideList.Industry_val12').subscribe(value => staticGuideList.Industry_val12 = value);
    this.translate.get('staticGuideList.Industry_val13').subscribe(value => staticGuideList.Industry_val13 = value);
    this.translate.get('staticGuideList.Industry_val14').subscribe(value => staticGuideList.Industry_val14 = value);
    this.translate.get('staticGuideList.Industry_val15').subscribe(value => staticGuideList.Industry_val15 = value);
    this.translate.get('staticGuideList.Industry_val16').subscribe(value => staticGuideList.Industry_val16 = value);
    this.translate.get('staticGuideList.Industry_val17').subscribe(value => staticGuideList.Industry_val17 = value);
    this.translate.get('staticGuideList.Industry_val18').subscribe(value => staticGuideList.Industry_val18 = value);
    this.translate.get('staticGuideList.Industry_val19').subscribe(value => staticGuideList.Industry_val19 = value);
    this.translate.get('staticGuideList.Industry_val20').subscribe(value => staticGuideList.Industry_val20 = value);
    this.translate.get('staticGuideList.Industry_val21').subscribe(value => staticGuideList.Industry_val21 = value);
    this.translate.get('staticGuideList.Industry_val22').subscribe(value => staticGuideList.Industry_val22 = value);
    this.translate.get('staticGuideList.Industry_val23').subscribe(value => staticGuideList.Industry_val23 = value);
    this.translate.get('staticGuideList.Industry_val24').subscribe(value => staticGuideList.Industry_val24 = value);
    this.translate.get('staticGuideList.Industry_val25').subscribe(value => staticGuideList.Industry_val25 = value);
    this.translate.get('staticGuideList.Industry_val26').subscribe(value => staticGuideList.Industry_val26 = value);
    this.translate.get('staticGuideList.Industry_val27').subscribe(value => staticGuideList.Industry_val27 = value);
    this.translate.get('staticGuideList.Industry_val28').subscribe(value => staticGuideList.Industry_val28 = value);
    this.translate.get('staticGuideList.Industry_val29').subscribe(value => staticGuideList.Industry_val29 = value);
    this.translate.get('staticGuideList.Industry_val30').subscribe(value => staticGuideList.Industry_val30 = value);

    this.translate.get('staticGuideList.DisplayPeriod_val1').subscribe(value => staticGuideList.DisplayPeriod_val1 = value);
    this.translate.get('staticGuideList.DisplayPeriod_val2').subscribe(value => staticGuideList.DisplayPeriod_val2 = value);
    this.translate.get('staticGuideList.DisplayPeriod_val3').subscribe(value => staticGuideList.DisplayPeriod_val3 = value);
    this.translate.get('staticGuideList.DisplayPeriod_val4').subscribe(value => staticGuideList.DisplayPeriod_val4 = value);

    this.translate.get('staticGuideList.Schedule_val1').subscribe(value => staticGuideList.Schedule_val1 = value);
    this.translate.get('staticGuideList.Schedule_val2').subscribe(value => staticGuideList.Schedule_val2 = value);
    this.translate.get('staticGuideList.Schedule_val3').subscribe(value => staticGuideList.Schedule_val3 = value);
    this.translate.get('staticGuideList.Schedule_val4').subscribe(value => staticGuideList.Schedule_val4 = value);
    this.translate.get('staticGuideList.Schedule_val5').subscribe(value => staticGuideList.Schedule_val5 = value);

    this.translate.get('staticGuideList.Employment_val1').subscribe(value => staticGuideList.Employment_val1 = value);
    this.translate.get('staticGuideList.Employment_val2').subscribe(value => staticGuideList.Employment_val2 = value);
    this.translate.get('staticGuideList.Employment_val3').subscribe(value => staticGuideList.Employment_val3 = value);
    this.translate.get('staticGuideList.Employment_val4').subscribe(value => staticGuideList.Employment_val4 = value);
    this.translate.get('staticGuideList.Employment_val5').subscribe(value => staticGuideList.Employment_val5 = value);

    this.translate.get('staticGuideList.Experience_val1').subscribe(value => staticGuideList.Experience_val1 = value);
    this.translate.get('staticGuideList.Experience_val2').subscribe(value => staticGuideList.Experience_val2 = value);
    this.translate.get('staticGuideList.Experience_val3').subscribe(value => staticGuideList.Experience_val3 = value);
    this.translate.get('staticGuideList.Experience_val4').subscribe(value => staticGuideList.Experience_val4 = value);

    this.translate.get('staticGuideList.TimePlacement_val1').subscribe(value => staticGuideList.TimePlacement_val1 = value);
    this.translate.get('staticGuideList.TimePlacement_val2').subscribe(value => staticGuideList.TimePlacement_val2 = value);
    this.translate.get('staticGuideList.TimePlacement_val3').subscribe(value => staticGuideList.TimePlacement_val3 = value);
    this.translate.get('staticGuideList.TimePlacement_val4').subscribe(value => staticGuideList.TimePlacement_val4 = value);
    this.translate.get('staticGuideList.TimePlacement_val5').subscribe(value => staticGuideList.TimePlacement_val5 = value);


    /*
      GenderList_val2 = 'Мужской';
      GenderList_val3 = 'Женский';
      Education_val1 = 'Бакалавр';
      Education_val2 = 'Аспирантура';
      Education_val3 = 'Магистр';
      Education_val4 = '3 класса';
      Education_val5 = 'Среднее';
      LanguageList_val2 = 'Русский';
      LanguageList_val3 = 'Английский';
      LanguageList_val4 = 'Арабский';
      LanguageList_val5 = 'Испанский';
      LanguageList_val6 = 'Китайский';
      LanguageList_val7 = 'Немецкий';
      LanguageList_val8 = 'Португальский';
      LanguageList_val9 = 'Турецкий';
      LanguageList_val10 = 'Финский';
      LanguageList_val11 = 'Французский';
      LanguageList_val12 = 'Шведский';
      LanguageList_val13 = 'Японский';

      LevelLanguage_val2 = 'Родной';
      LevelLanguage_val3 = 'А1';
      LevelLanguage_val4 = 'А2';
      LevelLanguage_val5 = 'В1';
      LevelLanguage_val6 = 'В2';
      LevelLanguage_val7 = 'С1';
      LevelLanguage_val8 = 'С2';

      Industry_val2 = 'Гостиницы, рестораны, общепит, кейтеринг';
      Industry_val1 = 'Автомобильный бизнес';
      Industry_val3 = 'Государственные организации';
      Industry_val4 = 'Добывающая отрасль';
      Industry_val5 = 'ЖКХ';
      Industry_val6 = 'Информационные технологии, системная интеграция, интернет';
      Industry_val7 = 'Искусство, культура';
      Industry_val8 = 'Лесная промышленность, деревообработка';
      Industry_val9 = 'Медицина, фармацевтика, аптеки';
      Industry_val10 = 'Металлургия, металлообработка';
      Industry_val11 = 'Нефть и газ';
      Industry_val12 = 'Образовательные учреждения';
      Industry_val13 = 'Общественная деятельность, партии, благотворительность, НКО';
      Industry_val14 = 'Перевозки, логистика, склад, ВЭД';
      Industry_val15 = 'Продукты питания';
      Industry_val16 = 'Промышленное оборудование, техника, станки и комплектующие';
      Industry_val17 = 'Розничная торговля';
      Industry_val18 = 'СМИ, маркетинг, реклама, BTL, PR, дизайн, продюсирование';
      Industry_val19 = 'Сельское хозяйство';
      Industry_val20 = 'Строительство, недвижимость, эксплуатация, проектирование';
      Industry_val21 = 'Телекоммуникации, связь';
      Industry_val22 = 'Товары народного потребления (непищевые)';
      Industry_val23 = 'Тяжелое машиностроение';
      Industry_val24 = 'Управление многопрофильными активами';
      Industry_val25 = 'Услуги для бизнеса';
      Industry_val26 = 'Услуги для населения';
      Industry_val27 = 'Финансовый сектор';
      Industry_val28 = 'Химическое производство, удобрения';
      Industry_val29 = 'Электроника, приборостроение, бытовая техника, компьютеры и оргтехника';
      Industry_val30 = 'Энергетика';
      DisplayPeriod_val1 = '1 месяц';
      DisplayPeriod_val2 = '2 месяца';
      DisplayPeriod_val3 = '3 месяца';
      DisplayPeriod_val4 = 'Безсрочно';
      Schedule_val1 = 'Полный день';
      Schedule_val2 = 'Гибкий график';
      Schedule_val3 = 'Сменный график';
      Schedule_val4 = 'Вахтовый метод';
      Schedule_val5 = 'Удаленная работа';
      Employment_val1 = 'Полная занятость';
      Employment_val2 = 'Частичная занятость';
      Employment_val3 = 'Проектная работа';
      Employment_val4 = 'Стажировка';
      Employment_val5 = 'Волонтерство';
      Experience_val1 = 'Без опыта';
      Experience_val2 = 'От 1 до 3 лет';
      Experience_val3 = 'От 3 до 5 лет';
      Experience_val4 = 'Более 5 лет';



      this.translate.get('staticGuideList.TimePlacement_val1 = '1 неделя';
      this.translate.get('staticGuideList.TimePlacement_val2 = '2 недели';
      this.translate.get('staticGuideList.TimePlacement_val3 = '1 месяц';
      this.translate.get('staticGuideList.TimePlacement_val4 = '2 месяца';
      this.translate.get('staticGuideList.TimePlacement_val5 = '3 месяца';
  */
  }



}
