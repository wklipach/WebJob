import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialogminimum',
  templateUrl: './dialogminimum.component.html',
  styleUrls: ['./dialogminimum.component.css']
})
export class DialogminimumComponent implements OnInit {

  @Input() name: string;

  constructor() { }

  ngOnInit() {
  }

}




