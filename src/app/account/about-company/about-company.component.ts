import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-company',
  templateUrl: './about-company.component.html',
  styleUrls: ['./about-company.component.css']
})
export class AboutCompanyComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    const id_user = window.localStorage.getItem('about_user');
    console.log('описываем лицо №', id_user);


  }

}
