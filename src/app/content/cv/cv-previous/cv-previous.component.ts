import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Previous} from '../../../class/Previous';
import {Subscription} from 'rxjs';
import {PreviousService} from '../../../services/previous.service';

@Component({
  selector: 'app-cv-previous',
  templateUrl: './cv-previous.component.html',
  styleUrls: ['./cv-previous.component.css']
})
export class CvPreviousComponent implements OnInit {

  public iIndex: number = 0;
  formPrevious: FormGroup;
  private previousSubscription: Subscription;

  constructor(private ps: PreviousService) {
    this.formPrevious = new FormGroup({
      'startDate': new FormControl('',[]),
      'completionDate': new FormControl('',[]),
      'company': new FormControl('',[]),
      'previousPosition': new FormControl('',[]),
      'inputPositionDescription': new FormControl('',[]),
      'inputSkillsAbilities': new FormControl('',[])
    });



    /* возвращаем данные по событию в отбельной переменной. Для каждого блока свое событие, в итоге они суммируются в списке */

    this.previousSubscription = this.ps.onCheckPrevious.subscribe((value: number) =>
      {
        this.ps.setPrevious(this.accumulationOfData());
      }
    );

  }


  public getIndex(): number {
     return this.iIndex;
 }

  protected setIndex(i: number) {
    this.iIndex = i;
  }


  accumulationOfData(): Previous
  {
     const t = new Previous();
      t.id_cv = -1;
      t.dStartDate = this.formPrevious.controls['startDate'].value;
      t.dCompletionDate = this.formPrevious.controls['completionDate'].value;
      t.sCompany = this.formPrevious.controls['company'].value;
      t.sPreviousPosition = this.formPrevious.controls['previousPosition'].value;
      t.sInputPositionDescription = this.formPrevious.controls['inputPositionDescription'].value;
      t.sInputSkillsAbilities = this.formPrevious.controls['inputSkillsAbilities'].value;
    return t;
  }

  ngOnInit() {
  }

  checkNumberPrevious() {
    this.ps.startOnDeletePrevious(this.getIndex());

  }

  ngOnDestroy() {
    if (typeof this.previousSubscription !== 'undefined') {
      this.previousSubscription.unsubscribe();
    }
  }


}
