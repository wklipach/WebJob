import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-newcv',
  templateUrl: './newcv.component.html',
  styleUrls: ['./newcv.component.css']
})
export class NewcvComponent implements OnInit {

  newCVForm: FormGroup;

  constructor() {


    this.newCVForm = new FormGroup({
      'name': new FormControl('',[]),
      'surname': new FormControl('',[]),
      'dateBirth': new FormControl('',[]),
      'inputSalaryFrom': new FormControl('',[]),
      'position': new FormControl('',[]),
      'startDate': new FormControl('',[]),
      'completionDate': new FormControl('',[]),
      'company': new FormControl('',[]),
      'previousPosition': new FormControl('',[]),
      'inputPositionDescription': new FormControl('',[]),
      'inputPositionDescription2': new FormControl('',[]),
      'inputSkillsAbilities': new FormControl('',[]),
      'startDate2': new FormControl('',[]),
      'completionDate2': new FormControl('',[]),
      'company2': new FormControl('',[]),
      'previousPosition2': new FormControl('',[]),
      'inputSkillsAbilities2': new FormControl('',[])
    });


  }

  ngOnInit() {
  }

  submit() {
    console.log('submit');

  }

}
