import {AfterViewInit, Component, ElementRef, HostListener, Inject, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale-chromatic';
import {ContributorResponse} from '../../../types/Contributor';
import {MatSnackBar} from '@angular/material';

export const DOTS_AREA = 14 ** 2;

@Component({
  selector: 'viz-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
  animations: [
    trigger('dotsAnimation', [
      transition('false => true', [
        query('.dot', style({ opacity: '0'})),
        query('.dot',
          stagger('30ms', [
            animate('100ms', style({ opacity: '1'}))
          ]))
      ])
    ])
  ]
})
export class BarComponent implements OnInit, OnChanges {

  @Input()
  year: number;

  @Input()
  total: number;

  @Input()
  high: number;

  @Input()
  contribs: ContributorResponse[];

  // old: 336
  dots = [];
  dotsArea = 0;
  loaded = false;

  @HostListener('click')
  onclick() {
    if (this.contribs.length > 0) {
      this.dialog.open(PieChartDialogComponent, {
        width: '1000px',
        maxWidth: '100vw',
        data: {
          contribs: this.contribs
        }
      });
    } else {
      this.snackbar.open('No contribution data available', 'DISMISS');
    }
  }

  constructor(private elementRef: ElementRef, public dialog: MatDialog, public snackbar: MatSnackBar) {
  }

  ngOnInit() {
    setTimeout(() => {
      const rect = this.elementRef.nativeElement.parentElement.getBoundingClientRect();
      const width = rect.right - rect.left;
      const height = rect.bottom - rect.top;
      this.dotsArea = width * height;
      this.loaded = true;
      this.initDots();
    }, 0);
  }

  ngOnChanges() {
    this.initDots();
  }

  private initDots() {
    const maxDots = Math.floor(this.dotsArea / DOTS_AREA);
    const percent = this.total / this.high;
    const numDots = Math.floor(maxDots * percent);
    this.dots = new Array(numDots > 0 ? numDots - 2 : 0);
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

    const contribs = this.data.contribs;
    const allContribs = new Map();
    for (let i = 0; i < contribs.length; i++) {
      const contrib = contribs[i];
      for (let j = 0; j < contrib.contributors.length; j++) {
        const contributor = contrib.contributors[j];
        const oldValue = allContribs.get(contributor.org_name) || 0;
        const newValue = oldValue + Number(contributor.total);
        allContribs.set(contributor.org_name, newValue);
      }
    }

    const data = Array.from(allContribs)
      .map(([name, value]) => {
        return {org: name, contribution: value};
      })
      .sort((a, b) => {
        if (a.contribution === b.contribution) {
          return 0;
        } else {
          return a.contribution > b.contribution ? -1 : 1;
        }
      })
      .slice(0, 10);

    const svg = d3.select(this.pie.nativeElement),
      width = +svg.attr('width'),
      height = +svg.attr('height'),
      radius = (Math.min(width, height) / 2) - 15,
      g = svg.append('g').attr('transform', `translate(${2 * width / 5}, ${(height / 2)})`);

    svg.on('click', function() {
      d3.selectAll('.org').transition()
        .duration(500)
        .ease(d3.easeLinear)
        .style('opacity', 1.0);
      d3.selectAll('.contrib.org').transition()
        .duration(500)
        .ease(d3.easeLinear)
        .style('opacity', 0);
      d3.event.stopPropagation();
    });

    const color = d3.scaleOrdinal(d3Scale.schemeCategory10);

    const pie = d3.pie()
      .sort(null)
      .value((d) => d['contribution']);

    const path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const label = d3.arc()
      .outerRadius(radius + 15)
      .innerRadius(radius + 15);

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
          .duration(500)
          .ease(d3.easeLinear)
          .style('opacity', 0.25);
        d3.selectAll('.contrib.org').transition()
          .duration(500)
          .ease(d3.easeLinear)
          .style('opacity', 0);
        d3.selectAll('.org-' + i).transition()
          .duration(500)
          .ease(d3.easeLinear)
          .style('opacity', 1.0);
        d3.event.stopPropagation();
      });

    arc.append('text')
      .attr('class', (d, i) => ('contrib org org-' + i))
      .attr('transform', d => `translate(${label.centroid(d as any)})`)
      .attr('dy', '0.35em')
      .style('opacity', 0)
      .text(d => `$${d.data['contribution']}`);

    const box_lw = 30;
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('font-size', 16)
      .attr('text-anchor', 'end')
      .attr('transform', `translate(-50, ${height / 7})`)
      .selectAll('g')
      .data(data, (d) => d['org'])
      .enter().append('g')
      .attr('transform', (d, i) => `translate(0, ${i * (box_lw + 2)})`);

    legend.append('rect')
      .attr('class', (d, i) => ('org org-' + i))
      .attr('x', width - box_lw)
      .attr('width', box_lw)
      .attr('height', box_lw)
      .attr('fill', (d, i) => color(i + ''))
      .on('click', (d, i) => {
        d3.selectAll('.org').transition()
          .duration(500)
          .ease(d3.easeLinear)
          .style('opacity', 0.25);
        d3.selectAll('.contrib.org').transition()
          .duration(500)
          .ease(d3.easeLinear)
          .style('opacity', 0);
        d3.selectAll('.org-' + i).transition()
          .duration(500)
          .ease(d3.easeLinear)
          .style('opacity', 1.0);
        d3.event.stopPropagation();
      });

    legend.append('text')
      .attr('class', (d, i) => ('org org-' + i) )
      .attr('x', width - (box_lw * 1.3))
      .attr('y', box_lw / 2)
      .attr('dy', '0.32em')
      .text((d) => {
        if (d.org.length > 30) {
          return d.org.substring(0, 30) + '...';
        } else {
          return d.org;
        }
      });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}
