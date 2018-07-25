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
import { NotFoundComponent } from './not-found/not-found.component';
import { CvComponent } from './content/cv/cv.component';
import { VacancyComponent } from './content/vacancy/vacancy.component';
import { NewVacancyComponent } from './content/new-vacancy/new-vacancy.component';

// определение маршрутов
const appRoutes: Routes = [
  { path: '', component: HeaderTopComponent },
   { path: 'login', component: LoginComponent },
  { path: 'advanced-search', component: AdvancedSearchComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'employee', component: RegisterEmployeeComponent},
  { path: 'employer', component: RegisterEmployerComponent},
  { path: 'rules', component: RulesComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'account-employee', component: AccountEmployeeComponent},
  {path: 'account-employer', component: AccountEmployerComponent},
  {path: 'home', component: HomeComponent},
  {path: 'cv', component: CvComponent},
  {path: 'vacancy', component: VacancyComponent},
  {path: 'new-vacancy', component: NewVacancyComponent},
  { path: '**', component: NotFoundComponent }
];



@NgModule({
  imports:
   [ BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, AngularFontAwesomeModule, RouterModule.forRoot(appRoutes)],
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
    VacancyComponent,
    NewVacancyComponent,
    NotFoundComponent
   ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
