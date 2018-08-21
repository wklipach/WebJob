import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-newcv',
  templateUrl: './newcv.component.html',
  styleUrls: ['./newcv.component.css']
})
export class NewcvComponent implements OnInit {

  newCVForm : FormGroup;

  constructor() { }

  ngOnInit() {
  }

  submit() {
    console.log('submit');

  }

}
