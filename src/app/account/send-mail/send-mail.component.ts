import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth-service.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SendMailService} from '../../services/send-mail.service';

@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.css']
})
export class SendMailComponent implements OnInit {

  bConnected = false;
  id_user: number;
  bEmployer : boolean;
  bChecked : boolean = false;
  formSendMail: FormGroup;


  constructor(private httpService: AuthService, private router: Router, private fb: FormBuilder, private sms: SendMailService) {

    this.formSendMail = this.fb.group({
      'inputWords': new FormControl('', []),
      'inputCheckBox': new FormControl('', [])
    });

  }

  ngOnInit() {

    var Res =  this.httpService.loginStorage();

    this.bConnected = Res.bConnected;
    this.bEmployer = Res.bEmployer;
    this.id_user = Res.id_user;

    if (!Res.bConnected) {
      this.router.navigate(['/']);
    }


    this.sms.getSendMailUserMask(this.id_user).subscribe(
      (value) => {

          if (value) {

          if (value[0].bMailing == true) this.bChecked = true; else this.bChecked = false;

          this.formSendMail.controls['inputWords'].setValue(value[0].sMailingMask);
         }
      });
  }


  SaveWords() {

    let str = this.formSendMail.controls['inputWords'].value;

    // let str = ",,,,,Привет!!как..дела??,,,,,,";
    // заменяем все символы пробелами
    str = str.replace(/\!/g, ' ');
    str = str.replace(/\|/g, ' ');
    str = str.replace(/\,/g, ' ');
    str = str.replace(/\./g, ' ');
    str = str.replace(/\?/g, ' ');
    str = str.replace(/\//g, ' ');
    str = str.replace(/\\/g, ' ');


    // все последовательности пробелов меняем на одиночные запятые
    str = str.replace(/\s+/g, ',');

    // если последний символ запятая убираем её
    if (str.length>0) {
      if (str[str.length-1] == ',') {
        str = str.substring(0, str.length - 1);
      }
    }

    // если первый символ запятая убираем её
    if (str.length>0) {
      if (str[0] == ',') {
        str = str.substring(1, str.length);
      }
    }

    if (this.bChecked && str.length==0) {
      return;
    }

    if (!this.bChecked) str = '';

    this.sms.setSendMailUserMask(this.id_user, str, this.bChecked).subscribe(
      (value) => {
        this.router.navigate(['/']);
      }
    );
    // getSendMailUserMask(id_user: number)


    // console.log('сохранить слова для поиска');
  }

  OnCheckInput() {

    this.bChecked = !this.bChecked;

    console.log('OnCheckInput');
  }

}
