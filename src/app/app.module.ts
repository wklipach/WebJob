import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderTopComponent } from './header-top/header-top.component';
import { RegisterComponent } from './entrance/registration/register/register.component';
import { FooterComponent } from './footer/footer.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { PersonalInformationComponent } from './account/personal-information/personal-information.component';
import { ForgotPasswordComponent } from './entrance/forgot-password/forgot-password.component';
import { LoginComponent } from './entrance/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import {AuthService} from './services/auth-service.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { RegisterEmployerComponent } from './entrance/registration/register-employer/register-employer.component';
import { RegisterEmployeeComponent } from './entrance/registration/register-employee/register-employee.component';
import { RulesComponent } from './rules/rules.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {AccountEmployeeComponent} from './account/account-employee/account-employee.component';
import {AccountEmployerComponent} from './account/account-employer/account-employer.component';
import { HomeComponent } from './home/home.component';
import { CvComponent } from './content/cv/cv.component';
import { NewVacancyComponent } from './content/vacancies/new-vacancy/new-vacancy.component';
import { AtempComponent } from './atemp/atemp.component';
import {GuideService} from './services/guide-service.service';
import { VacanciesComponent } from './content/vacancies/vacancies/vacancies.component';
import {NewVacancyService} from './services/new-vacancy.service';
import {TableVacancyService} from './services/table-vacancy.service';
import {VacancyDescriptionComponent } from './content/vacancies/vacancy-description/vacancy-description.component';
import {MoveService} from './services/move.service';
import { NewcvComponent } from './content/cv/newcv/newcv.component';
import {CvIndustryComponent} from './content/cv/cv-industry/cv_industry.component';
import { CvEmploymentComponent } from './content/cv/cv-employment/cv-employment.component';
import { CvScheduleComponent } from './content/cv/cv-schedule/cv-schedule.component';
import { CvExperienceComponent } from './content/cv/cv-experience/cv-experience.component';
import { CvEducationComponent } from './content/cv/cv-education/cv-education.component';
import { CvPreviousComponent } from './content/cv/cv-previous/cv-previous.component';
import {PreviousService} from './services/previous.service';
import {NewcvService} from './services/newcv.service';
import { CvListComponent } from './content/cv/cv-list/cv-list.component';
import {CvListService} from './services/cv-list.service';
import { CvEditComponent } from './content/cv/cv-edit/cv-edit.component';
import {CvEditService} from './services/cv-edit.service';
import {VacanciesListService} from './services/vacancies-list.service';
import { VacancyEditComponent } from './content/vacancies/vacancy-edit/vacancy-edit.component';
import { MessageCenterComponent } from './account/message-center/message-center/message-center.component';
import { MessagesComponent } from './account/message-center/messages/messages.component';
import { InfoComponent } from './account/message-center/info/info.component';
import { MessageComponent } from './account/message-center/message/message.component';
import { ResponseComponent } from './content/response/response.component';
import { NotFoundComponent } from './not-found/not-found.component';
import {LetterService} from './services/letter.service';
import { PageCountComponent } from './page-count/page-count.component';
import {NgbModule, NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { AboutComponent } from './about/about.component';
import { FavoritesComponent } from './account/favorites/favorites.component';
import { CvViewComponent } from './content/cv/cv-view/cv-view.component';
import {InfoService} from './services/info.service';
import { AboutCompanyComponent } from './account/about-company/about-company.component';
import { InfoPageComponent } from './account/message-center/info-page/info-page.component';
import { SchoolComponent } from './content/cv/school/school.component';
import { CvLanguageComponent } from './content/cv/cv-language/cv-language.component';
import {CvLanguageService} from './services/cv-language.service';
import { AdUnitComponent } from './ad-unit/ad-unit.component';
import { AdUnit2Component } from './ad-unit2/ad-unit2.component';
import {GlobalRef} from './services/globalref';
import {CvHomeComponent} from './content/cv/cv-home/cv-home.component';
import { SmainComponent } from './smain/smain.component';
import { CvhomeComponent } from './content/cv/cvhome/cvhome.component';
import { DialogminimumComponent } from './dialogs/dialogminimum/dialogminimum.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { InvitationComponent } from './content/invitation/invitation.component';
import {ForgotpasswordService} from './services/forgotpassword.service';
import { MessagesContainerComponent } from './account/message-center/container/messages-container/messages-container.component';
import { InfoContainerComponent } from './account/message-center/container/info-container/info-container.component';
import {TextToHtmlDirective} from './direct/text-to-html-directive';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ConfJDirective} from '../directive/conf-j.directive';



// определение маршрутов
const appRoutes: Routes = [
  {path: '', component: SmainComponent},
  {path: 'cv-home', component: CvHomeComponent},
  {path: 'home', component: HomeComponent},
  { path: 'header-top', component: HeaderTopComponent },
  { path: 'login', component: LoginComponent },
  { path: 'advanced-search', component: AdvancedSearchComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'employee', component: RegisterEmployeeComponent},
  { path: 'employer', component: RegisterEmployerComponent},
  { path: 'rules', component: RulesComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'account-employee', component: AccountEmployeeComponent},
  {path: 'account-employer', component: AccountEmployerComponent},
  {path: 'cv', component: CvComponent},
  {path: 'vacancies', component: VacanciesComponent},
  {path: 'new-vacancy', component: NewVacancyComponent},
  {path: 'atemp', component: AtempComponent},
  {path: 'vacancy-description', component: VacancyDescriptionComponent},
  {path: 'vacancy-edit', component: VacancyEditComponent},
  {path: 'newcv', component: NewcvComponent},
  {path: 'test', component: CvScheduleComponent},
  {path: 'cv-previous', component: CvPreviousComponent},
  {path: 'cv-list', component: CvListComponent},
  {path: 'cv-edit', component: CvEditComponent},
  {path: 'message-center', component: MessageCenterComponent},
  {path: 'messages', component: MessagesComponent},
  {path: 'message', component: MessageComponent},
  {path: 'info', component: InfoComponent},
  {path: 'info_page', component: InfoPageComponent},
  {path: 'response', component: ResponseComponent},
  {path: 'page-count', component: PageCountComponent},
  {path: 'about', component: AboutComponent},
  {path: 'about-company', component: AboutCompanyComponent},
  {path: 'favorites', component: FavoritesComponent},
  {path: 'cv-view', component: CvViewComponent},
  {path: 'school', component: SchoolComponent},
  {path: 'ad-unit', component: AdUnitComponent},
  {path: 'ad-unit2', component: AdUnit2Component},
  {path: 'smain', component: SmainComponent},
  {path: 'invitation', component: InvitationComponent},
  {path: '**', component: NotFoundComponent }
];


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}


@NgModule({
  imports:
   [ BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, AngularFontAwesomeModule,
     BrowserAnimationsModule,
     NgbModule, NgbPaginationModule, NgbAlertModule,

     TranslateModule.forRoot({
       loader: {
         provide: TranslateLoader,
         useFactory: HttpLoaderFactory,
         deps: [HttpClient]
       }
     }),
     RouterModule.forRoot(appRoutes)],
  declarations: [
    AppComponent,
    HeaderTopComponent,
    RegisterComponent,
    FooterComponent,
    AdvancedSearchComponent,
    PersonalInformationComponent,
    ForgotPasswordComponent,
    LoginComponent,
    RegisterEmployeeComponent,
    RegisterEmployerComponent,
    AccountEmployeeComponent,
    AccountEmployerComponent,
    RulesComponent,
    HomeComponent,
    CvComponent,
    NewVacancyComponent,
    AtempComponent,
    VacancyDescriptionComponent,
    NewcvComponent,
    CvIndustryComponent,
    CvEmploymentComponent,
    CvScheduleComponent,
    CvExperienceComponent,
    CvEducationComponent,
    CvPreviousComponent,
    CvListComponent,
    CvEditComponent,
    VacanciesComponent,
    VacancyEditComponent,
    MessageCenterComponent,
    MessagesComponent,
    InfoComponent,
    MessageComponent,
    ResponseComponent,
    PageCountComponent,
    AboutComponent,
    FavoritesComponent,
    CvViewComponent,
    InfoPageComponent,
    AboutCompanyComponent,
    SchoolComponent,
    NotFoundComponent,
    SchoolComponent,
    CvLanguageComponent,
    AdUnitComponent,
    CvHomeComponent,
    AdUnit2Component,
    SmainComponent,
    CvhomeComponent,
    DialogminimumComponent,
    InvitationComponent,
    MessagesContainerComponent,
    InfoContainerComponent,
    TextToHtmlDirective,
    ConfJDirective
   ],
  entryComponents: [
    CvPreviousComponent,
    CvLanguageComponent
  ],
  providers: [AuthService, GuideService, NewVacancyService, TableVacancyService,
              MoveService, PreviousService, NewcvService, CvListService, CvEditService,
              VacanciesListService, LetterService, InfoService, CvLanguageService, GlobalRef, ForgotpasswordService],
  bootstrap: [AppComponent]
})
export class AppModule { }
