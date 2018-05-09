import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {OpenSecretsService} from './shared/open-secrets.service';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {BarComponent} from './bar/bar.component';
import {map} from 'rxjs/operators';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'viz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('marblesAnimation', [
      transition('* => *', [
        query('.marble', style({ opacity: '0'})),
        query('.marble',
          stagger('10ms', [
            animate('1000ms', style({ opacity: '1'}))
          ]))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {

  // @ViewChildren(BarComponent) private bars: QueryList<BarComponent>;
  @ViewChild('marbleContainer') marbleContainer: ElementRef;

  organizations = [
    {
      name: 'Goldman Sachs',
      id: 'D000000085'
    },
    {
      name: 'Tufts University',
      id: 'D000030573'
    },
    {
      name: 'Harvard University',
      id: 'D000000544'
    },
    {
      name: 'National Rifle Association',
      id: 'D000000082'
    },
    {
      name: 'Planned Parenthood',
      id: 'D000000591'
    },
    {
      name: 'Autism Speaks',
      id: 'D000047522'
    },
    {
      name: 'Church of Jesus Christ/Latter Day Saints',
      id: 'D000044751'
    },
    {
      name: 'Trump Organization',
      id: 'D000030559'
    },
    {
      name: 'Clinton Foundation',
      id: 'D000032675'
    },
    {
      name: 'Susan G Komen Foundation',
      id: 'D000057325'
    },
  ];
  barDefs = [];
  parties = [
    {
      name: 'Republican',
      color: 'rgba(216, 23, 30, 1)',
      flex: null,
      code: 'R',
    },
    {
      name: 'Democrat',
      color: 'rgba(0, 174, 243, 1)',
      flex: null,
      code: 'D'
    },
    // TODO(CaerusKaru): There are currently no I or L in the 115th Congress
    // {
    //   name: 'Independent',
    //   color: 'rgba(0, 169, 92, 1)',
    //   flex: 20,
    //   code: '3'
    // },
    // {
    //   name: 'Other',
    //   color: 'rgba(0, 0, 0, 1)',
    //   flex: 10,
    //   code: 'L'
    // }
  ];
  rangeHigh = Number.MAX_SAFE_INTEGER;
  rangeValues = [];
  legislators = [];
  summaries = Array(BARS.length);
  contribRefs = Array(BARS.length);
  contribs = Array(BARS.length);
  currentName = null;

  private activated = false;
  private currentMarble = null;

  constructor(private openSecretsService: OpenSecretsService) {
    this.openSecretsService.getAllLegislatorsLocal().pipe(map(d => d.legislators))
      .subscribe(d => {this.legislators = d; this.getSum(); });

    // TODO: add destroy logic
    fromEvent(document, 'keypress').subscribe((evt: KeyboardEvent) => {
      if (evt.key !== 'Enter') {
        return;
      }
      if (document.activeElement.tagName === 'IMG') {
        this.activate(document.activeElement);
      }
    });
  }

  ngOnInit() {
    const barReqs = [];
    const contribReqs = [];
    for (let i = 0; i < BARS.length; i++) {
      const barDef = BARS[i];
      const req = this.openSecretsService.getSummariesLocal(barDef.year + '');
      const contribReq = this.openSecretsService.getContribsLocal(barDef.year + '');
      contribReqs.push(contribReq);
      barReqs.push(req);
    }

    forkJoin(barReqs).subscribe(d => {
      const newBars = BARS;
      d.forEach((e, i) => {
        newBars[i].total = e.reduce((acc, x) => acc + Number(x.total), 0);
        this.summaries[i] = e;
      });
      this.rangeHigh = Math.ceil(Math.max(...newBars.map(p => p.total)) / 1000) * 1000;
      this.rangeValues = Array.from(Array(11), (_, i) => i * (this.rangeHigh / 10));
      this.barDefs = newBars;
    });

    forkJoin(contribReqs)
      .subscribe(d => {
        d.forEach((e, i) => {
          this.contribs[i] = e;
        });
        this.contribRefs = [...this.contribs];
      });
  }

  activate(marble: any) {
    if (this.activated && marble !== this.currentMarble) {
      this.currentMarble.classList.remove('selected');
    }
    this.activated = true;
    marble.classList.add('selected');
    this.marbleContainer.nativeElement.classList.add('active');
    this.currentMarble = marble;

    const newBars = BARS;
    for (let i = 0; i < newBars.length; i++) {
      const summary = this.summaries[i].find(v => v.cid === marble.id);
      newBars[i].total = summary.total;
    }

    this.rangeHigh = Math.ceil(Math.max(...newBars.map(p => p.total)) / 1000) * 1000;
    this.rangeValues = Array.from(Array(11), (_, i) => i * (this.rangeHigh / 10));
    this.contribs.forEach((c, i) => {
      this.contribRefs[i] = [c.find(d => d.cid === marble.id)];
    });
    this.barDefs = newBars;
  }

  getSum() {
    // const legs = this.legislators.map(d => d.cid).slice(200, 400);
    // this.openSecretsService.getAllContribs(legs, '2012')
    //   .subscribe(console.log);
  }

  clear() {
    this.marbleContainer.nativeElement.classList.remove('active');
    this.activated = false;
    const newBars = BARS;
    this.summaries.forEach((e, i) => {
      newBars[i].total = e.reduce((acc, x) => acc + Number(x.total), 0);
    });
    this.rangeHigh = Math.ceil(Math.max(...newBars.map(p => p.total)) / 1000) * 1000;
    this.rangeValues = Array.from(Array(11), (_, i) => i * (this.rangeHigh / 10));
    this.barDefs = [];
    setTimeout(() => this.barDefs = newBars, 0);
    this.currentName = null;
    this.contribRefs = [...this.contribs];
  }
}

const BARS = [
  {
    name: '2012',
    year: 2012,
    total: 0
  },
  {
    name: '2014',
    year: 2014,
    total: 0
  },
  {
    name: '2016',
    year: 2016,
    total: 0
  },
  {
    name: '2018 (so far)',
    year: 2018,
    total: 0
  },
];
