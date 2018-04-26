import {AfterViewInit, Component, ElementRef, Input, OnInit} from '@angular/core';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'viz-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
  animations: [
    trigger('dotsAnimation', [
      transition('* => *', [
        query('.dot', style({ opacity: '0'})),
        query('.dot',
          stagger('30ms', [
            animate('100ms', style({ opacity: '1'}))
          ]))
      ])
    ])
  ]
})
export class BarComponent implements OnInit, AfterViewInit {

  @Input()
  year: string;

  dots = new Array(Math.ceil(336 * Math.random()));

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const height = rect.bottom - rect.top;
    const width = rect.right - rect.left;
    console.log(width * height);
  }

}
