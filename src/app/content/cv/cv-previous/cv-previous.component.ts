import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Previous} from '../../../class/Previous';
import {Subscription} from 'rxjs';
import {PreviousService} from '../../../services/previous.service';

@Component({
  selector: 'app-cv-previous',
  templateUrl: './cv-previous.component.html',
  styleUrls: ['./cv-previous.component.css']
})
export class CvPreviousComponent implements OnInit, OnDestroy {

  public iIndex = 0;
  formPrevious: FormGroup;
  private previousSubscription: Subscription;
  private previousLoadSubscription: Subscription;

  constructor(private ps: PreviousService) {
    this.formPrevious = new FormGroup({
      'startDate': new FormControl('', []),
      'completionDate': new FormControl('', []),
      'inputCompany': new FormControl('', []),
      'inputpPreviousPosition': new FormControl('', []),
      'inputPositionDescription': new FormControl('', []),
      'inputSkillsAbilities': new FormControl('', [])
    });


    /* возвращаем данные по событию в отбельной переменной. Для каждого блока свое событие, в итоге они суммируются в списке */
    this.previousSubscription = this.ps.onCheckPrevious.subscribe((value: number) => {
        this.ps.setPrevious(this.accumulationOfData());
      }
    );


    this.previousLoadSubscription = this.ps.onLoadPrevious.subscribe((value: Previous) => {
        console.log('this.iIndex=' + this.iIndex);
        this.loaddata(value);
      }
    );
  }


  public getIndex(): number {
     return this.iIndex;
 }

  protected setIndex(i: number) {
    this.iIndex = i;
  }

  startLoadPrevious(curPrevious: Previous) {
    this.ps.startLoadPrevious(curPrevious);
  }


  loaddata(p: Previous) {

    if (typeof p.dStartDate !== 'undefined') {
      this.formPrevious.controls['startDate'].setValue(p.dStartDate);
    }

    if (typeof p.dCompletionDate !== 'undefined') {
      this.formPrevious.controls['completionDate'].setValue(p.dCompletionDate);
    }

    if (typeof p.sCompany !== 'undefined') {
      this.formPrevious.controls['inputCompany'].setValue(p.sCompany);
    }

    if (typeof p.sPreviousPosition !== 'undefined') {
      this.formPrevious.controls['inputpPreviousPosition'].setValue(p.sPreviousPosition);
    }

    if (typeof p.sInputPositionDescription !== 'undefined') {
      this.formPrevious.controls['inputPositionDescription'].setValue(p.sInputPositionDescription);
    }

    if (typeof p.sInputSkillsAbilities !== 'undefined') {
      this.formPrevious.controls['inputSkillsAbilities'].setValue(p.sInputSkillsAbilities);
    }
  }


  accumulationOfData(): Previous  {
     const t = new Previous();
      t.id_cv = -1;
      t.dStartDate = this.formPrevious.controls['startDate'].value;
      t.dCompletionDate = this.formPrevious.controls['completionDate'].value;
      t.sCompany = this.formPrevious.controls['inputCompany'].value;
      t.sPreviousPosition = this.formPrevious.controls['inputpPreviousPosition'].value;
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

    if (typeof this.previousLoadSubscription !== 'undefined') {
      this.previousLoadSubscription.unsubscribe();
    }

  }


}
