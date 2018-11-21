import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-page-count',
  templateUrl: './page-count.component.html',
  styleUrls: ['./page-count.component.css']
})
export class PageCountComponent implements OnInit {

  @Input() numberOfVisiblePages: number = 5;
  @Input() numberOfRecordsPerAll: number = 28;
  @Input() currentPage: number;
  @Output() currentPageChange = new EventEmitter<number>();


  private _numberOfRecordsPerPage = 10;

  protected numberOfPage: string[] = [];
  private _numberOfPage: number = 1;

  constructor() {

    console.log('constructor', this.currentPage);

  }

  @Input()
  set numberOfRecordsPerPage(numberRecords: number) {

      this._numberOfRecordsPerPage = numberRecords;
  }

  get numberOfRecordsPerPage() { return this._numberOfRecordsPerPage; }



  onCurrentPageChange(pageNumber: number){

    if (this.moveLeftBlockPages(pageNumber) === false)
        this.moveRightBlockPages(pageNumber);

    this.currentPage = pageNumber;
    this.currentPageChange.emit(pageNumber);
  }


  moveRightBlockPages(pageNumber: number) {

    var bMove: boolean = false;
    var bLastMove: boolean = false;

    var curIndex = this.numberOfPage.indexOf(pageNumber.toString());
    var curValuePage = this.numberOfPage[curIndex];

    //страница должна быть больше чем 1
    if (parseInt(curValuePage)>1) {
      //если index=0 сдвигаем
      if (curIndex === 0) bMove = true;

      //если index>0, но предыдущий '...' сдвигаем
      if (curIndex > 0) {
        if (this.numberOfPage[curIndex - 1] === '...')
          bLastMove = true;
      }
    }

    //переменная показывает что надо сдвигать потому что первая страница больше первой
    if (bMove) {
      //сдвигаем влево на 1/2 от numberOfVisiblePages
      var rightMove = Math.floor(this.numberOfVisiblePages/2);
      var newFirstPage = pageNumber - rightMove;
      if (newFirstPage<1) newFirstPage = 1;
      this.RepeatInitializePages(newFirstPage);
    }

    if (bLastMove) {
      var newLastPage = pageNumber - this.numberOfVisiblePages;
      if (newLastPage<1) newLastPage = 1;
      this.RepeatInitializePages(newLastPage);
    }


  };


  moveLeftBlockPages(pageNumber: number): boolean {
    var curIndex = this.numberOfPage.indexOf(pageNumber.toString());
    var curValuePage = this.numberOfPage[curIndex];
    //если это не последняя страница смотрим следующую, если это '...' сдвигаем пагинатор
     if (parseInt(curValuePage) <this._numberOfPage) {
       if (this.numberOfPage[curIndex+1] ==='...') {

               //если это последний промежуток, ничего не двигаем
               if (parseInt(this.numberOfPage[curIndex]) === parseInt(this.numberOfPage[curIndex+2])-1) {
                 return true;
               }

               //сдвигаем влево на 1/2 от numberOfVisiblePages
               var leftMove = Math.floor(this.numberOfVisiblePages/2);
               var newFirstPage = pageNumber - leftMove;
               this.RepeatInitializePages(newFirstPage);
               return true;
       } else return false;
     } else return false;
  };


  RepeatInitializePages(newFirstPage: number) {

    this.numberOfPage = [];
    //this.numberOfPage.push('1');

    for (var i = 0; i < this.numberOfVisiblePages; i++) {

      var curPage = newFirstPage+i;
      this.numberOfPage.push(curPage.toString());

      //если это последняя страница выходим
      if (curPage === this._numberOfPage) return;

      //если последняя итерация, а страница не последняя лобавляем многоточие и последнюю страницу
      if (i === (this.numberOfVisiblePages-1)) {
        if (curPage !== this._numberOfPage) {
          this.numberOfPage.push('...');
          this.numberOfPage.push(this._numberOfPage.toString());
        }
      }

    }

  }

  ngOnInit() {
    this._numberOfPage = Math.ceil(this.numberOfRecordsPerAll / this.numberOfRecordsPerPage);
    this.InitializePages();
  }

  //рисуем первоначальный блок со страничками
  InitializePages() {

    this.numberOfPage = [];

    for (var i = 1; i <= this._numberOfPage; i++) {
      if (i<=this.numberOfVisiblePages)  this.numberOfPage.push(i.toString()); else {
        if (i<this._numberOfPage) {
          this.numberOfPage.push('...');
          this.numberOfPage.push(this._numberOfPage.toString());
        }
        return;
      }
    }
  };

  onFirstPage() {
    if (this._numberOfPage <=0) return;
    this.InitializePages();
    this.onCurrentPageChange( 1);

  }

  onLastPage() {
    this.moveRightBlockPages(this._numberOfPage);
    this.onCurrentPageChange( this._numberOfPage);
  }

  onNextPage() {
    //перевод в стринг из-за арифметки - this.currentPage хоть и number системой видится как стринг при арифметике
    if (this.currentPage === this._numberOfPage) return;
    var nextStringPage = this.currentPage.toString();
    this.onCurrentPageChange(parseInt(nextStringPage)+1);
  }

  onPriorPage() {
    //перевод в стринг из-за арифметки - this.currentPage хоть и number системой видится как стринг при арифметике
    if (this.currentPage === 1) return;
    var priorStringPage = this.currentPage.toString();
    this.onCurrentPageChange(parseInt(priorStringPage)-1);
  }


}
