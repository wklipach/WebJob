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
import {HttpClientModule} from '@angular/common/http';
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
import { NotFoundComponent } from './not-found/not-found.component';
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


// определение маршрутов
const appRoutes: Routes = [
  {path: '', component: HomeComponent},
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
  {path: 'info', component: InfoComponent},
  {path: '**', component: NotFoundComponent }
];



@NgModule({
  imports:
   [ BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, AngularFontAwesomeModule,
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
    NotFoundComponent
   ],
  entryComponents: [
    CvPreviousComponent
  ],
  providers: [AuthService, GuideService, NewVacancyService, TableVacancyService,
              MoveService, PreviousService, NewcvService, CvListService, CvEditService, VacanciesListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
