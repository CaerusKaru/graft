import {AfterViewInit, Component, ElementRef, HostListener, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import * as d3 from 'd3';

@Component({
  selector: 'viz-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
  animations: [
    trigger('dotsAnimation', [
      transition('void => *', [
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

  // old: 336
  dots = new Array(Math.ceil(276 * Math.random()));

  @HostListener('click')
  onclick() {
    this.dialog.open(PieChartDialogComponent, {
      width: '1000px',
      maxWidth: '100vw'
    });
  }

  constructor(private elementRef: ElementRef, public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const height = rect.bottom - rect.top;
    const width = rect.right - rect.left;
    console.log(width * height);
  }

  update() {
    this.dots = [];
    // wait a tick so that the change detection can re-run the animation
    setTimeout(() => {
      this.dots = new Array(Math.ceil(336 * Math.random()));
    }, 0);
  }

}

@Component({
  selector: 'viz-pie-chart-dialog',
  template: `<svg width='900' height='500' #pie></svg>`,
  styles: [
    `
.arc text {
  font: 24px;
  text-anchor: middle;
}

.arc path {
  stroke: #fff;
}
`
  ]
})
export class PieChartDialogComponent implements AfterViewInit {

  @ViewChild('pie') private pie: ElementRef;

  constructor(public dialogRef: MatDialogRef<PieChartDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {


  }

  ngAfterViewInit() {
    const yellow = d3.interpolateYlGn(0), // 'rgb(255, 255, 229)'
      yellowGreen = d3.interpolateYlGn(0.5), // 'rgb(120, 197, 120)'
      green = d3.interpolateYlGn(1); // 'rgb(0, 69, 41)'

    const svg = d3.select(this.pie.nativeElement),
      width = +svg.attr('width'),
      height = +svg.attr('height'),
      radius = Math.min(width, height) / 2,
      g = svg.append('g').attr('transform', 'translate(' + (23 * width / 32) + ',' + (height / 2) + ')');

    svg.on('click', function() {
      d3.selectAll('.org').transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .style('opacity', 1.0);
      d3.event.stopPropagation();
    });

    const color = d3.scaleOrdinal(d3.schemeBrBG[11]);

    const pie = d3.pie()
      .sort(null)
      .value((d) => d['contribution']);

    const path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const label = d3.arc()
      .outerRadius(radius - 75)
      .innerRadius(radius - 75);

    const data = [
      {
        org: 'Tufts University',
        contribution: 50000
      },
      {
        org: 'ExxonMobil',
        contribution: 20000
      },
      {
        org: 'Facebook',
        contribution: 75000
      },
      {
        org: 'Google',
        contribution: 100000
      },
      {
        org: 'Palantir',
        contribution: 35115
      },
      {
        org: 'Sesame Street',
        contribution: 56415
      },
      {
        org: 'Fannie Mae',
        contribution: 65410
      },
      {
        org: 'Tesla',
        contribution: 4441
      },
      {
        org: 'The Man',
        contribution: 13254
      },
      {
        org: 'The All-New $1 Triple Melt Burrito by Taco Bell',
        contribution: 41323
      },
      {
        org: 'Other',
        contribution: 30246
      },
    ];

    const arc = g.selectAll('.arc')
      .data(pie(data as any))
      .enter().append('g')
      .attr('class', 'arc');

    arc.append('path')
      .attr('class', (d, i) => ('org org-' + i))
      .attr('d', path as any)
      .attr('fill', (d, i) => color(i + ''))
      .on('click', function(d, i) {
        d3.selectAll('.org').transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .style('opacity', 0.25);
        d3.selectAll('.org-' + i).transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .style('opacity', 1.0);
        d3.event.stopPropagation();
      });

    const box_lw = 30;
    const legend = svg.append('g')
      .attr('font-size', 16)
      .attr('text-anchor', 'end')
      .attr('transform', 'translate(' + -(3 * width) / 5 + ',' + (height / 11) + ')')
      .selectAll('g')
      .data(data, (d) => d['org'])
      .enter().append('g')
      .attr('transform', function(d, i) { return 'translate(' + 0 + ',' + i * (box_lw + 2) + ')'; });

    legend.append('rect')
      .attr('class', (d, i) => ('org org-' + i))
      .attr('x', width - box_lw)
      .attr('width', box_lw)
      .attr('height', box_lw)
      .attr('fill', (d, i) => color(i + ''))
      .on('click', (d, i) => {
        arc.append('text')
          .attr('transform', (e) => ('translate(' + label.centroid(e as any) + ')'))
          .attr('dy', '0.35em')
          .text((e) => e['contribution']);
        d3.selectAll('.org').transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .style('opacity', 0.25);
        d3.selectAll('.org-' + i).transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .style('opacity', 1.0);
        d3.event.stopPropagation();
      });

    legend.append('text')
      .attr('class', (d, i) => ('org org-' + i) )
      .attr('x', width - (box_lw * 1.3))
      .attr('y', box_lw / 2)
      .attr('dy', '0.32em')
      .text(function(d) { return d.org; });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}
