import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderTopComponent } from './header-top/header-top.component';
import { RegisterComponent } from './entrance/registration/register/register.component';
import { FooterComponent } from './footer/footer.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { PersonalInformationComponent } from './panel/personal-information/personal-information.component';
import { ForgotPasswordComponent } from './entrance/forgot-password/forgot-password.component';
import { LoginComponent } from './entrance/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import {AuthService} from './services/auth-service.service';
import {HttpClientModule} from '@angular/common/http';
import { RegisterEmployerComponent } from './entrance/registration/register-employer/register-employer.component';
import { RegisterEmployeeComponent } from './entrance/registration/register-employee/register-employee.component';
import { RulesComponent } from './rules/rules.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {Controlpanel1Component} from './panel/controlpanel1/controlpanel1.component';
import {Controlpanel2Component} from './panel/controlpanel2/controlpanel2.component';

// определение маршрутов
const appRoutes: Routes = [
  { path: '', component: HeaderTopComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'employee', component: RegisterEmployeeComponent},
  { path: 'employer', component: RegisterEmployerComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'controlpanel1', component: Controlpanel1Component},
  {path: 'controlpanel2', component: Controlpanel2Component},
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
    Controlpanel1Component,
    Controlpanel2Component,
    RulesComponent,
    NotFoundComponent
   ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
