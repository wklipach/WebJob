import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-atemp',
  templateUrl: './atemp.component.html',
  styleUrls: ['./atemp.component.css']
})
export class AtempComponent implements OnInit {

  constructor(public translate: TranslateService) { }

  ngOnInit() {
  }

}
