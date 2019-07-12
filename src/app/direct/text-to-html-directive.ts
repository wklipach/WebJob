import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appTextToHtml]'
})
export class TextToHtmlDirective implements AfterViewInit {


  @Input() sourceText: string;

  constructor(private Element: ElementRef) {

  }

  ngAfterViewInit(): void {
    this.Element.nativeElement.innerHTML = this.sourceText.replace(/[\r\n]/gmi, '<br/>').replace(/ /gmi, '&nbsp;');
  }

}
