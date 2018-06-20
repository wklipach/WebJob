import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderTopComponent } from './header-top/header-top.component';
import { RegisterComponent } from './register/register.component';
import { FooterComponent } from './footer/footer.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import {AuthService} from './services/auth-service.service';
import {HttpClientModule} from '@angular/common/http';
import { RegisterEmployerComponent } from './register-employer/register-employer.component';
import { RegisterEmployeeComponent } from './register-employee/register-employee.component';
import { RulesComponent } from './rules/rules.component';


// определение маршрутов
const appRoutes: Routes =[
  { path: '', component: HeaderTopComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: '**', component: NotFoundComponent }
];



@NgModule({
  imports:
   [ BrowserModule, HttpClientModule, RouterModule.forRoot(appRoutes)],
  declarations: [
    AppComponent,
    HeaderTopComponent,
    RegisterComponent,
    FooterComponent,
    AdvancedSearchComponent,
    PersonalInformationComponent,
    ForgotPasswordComponent,
    NotFoundComponent,
    LoginComponent
   ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
