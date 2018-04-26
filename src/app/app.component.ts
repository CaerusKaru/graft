import {Component, OnInit} from '@angular/core';
import {OpenSecretsService} from './shared/open-secrets.service';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';

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

  chartData: any[];
  marbles = MARBLES

  constructor(private openSecretsService: OpenSecretsService) {
    // this.openSecretsService.candContrib('N00007360')
    //   .subscribe(console.log);
    //
    // this.openSecretsService.candIndByInd('N00007360', 'K02', '2014')
    //   .subscribe(console.log);
    //
    // this.openSecretsService.candIndustry('N00007360')
    //   .subscribe(console.log);
    //
    // this.openSecretsService.candSector('N00007360')
    //   .subscribe(console.log);
    //
    // this.openSecretsService.getLegislators('N00007360')
    //   .subscribe(console.log);
    //
    // this.openSecretsService.getAllLegislators()
    //   .subscribe(console.log);
  }

  ngOnInit() {
    // give everything a chance to get loaded before starting the animation to reduce choppiness
    setTimeout(() => {
      this.generateData();
      // change the data periodically
      setInterval(() => this.generateData(), 3000);
    }, 1000);
  }

  generateData() {
    this.chartData = [];
    for (let i = 0; i < (8 + Math.floor(Math.random() * 10)); i++) {
      this.chartData.push([`Index ${i}`, Math.floor(Math.random() * 100)]);
    }
  }
}

const MARBLES = [
  'N00000078',
  'N00000153',
  'N00000179',
  'N00000267',
  'N00000270',
  'N00000362',
  'N00000491',
  'N00000515',
  'N00000528',
  'N00000575',
  'N00000615',
  'N00000684',
  'N00000699',
  'N00000751',
  'N00000781',
  'N00000851',
  'N00000898',
  'N00000939',
  'N00001003',
  'N00001024',
  'N00001093',
  'N00001102',
  'N00001127',
  'N00001171',
  'N00001193',
  'N00001285',
  'N00001311',
  'N00001373',
  'N00001489',
  'N00001619',
  'N00001758',
  'N00001811',
  'N00001813',
  'N00001821',
  'N00001955',
  'N00001971',
  'N00002097',
  'N00002147',
  'N00002221',
  'N00002260',
  'N00002299',
  'N00002408',
  'N00002424',
  'N00002577',
  'N00002593',
  'N00002674',
  'N00002858',
  'N00002884',
  'N00002893',
  'N00002942',
  'N00003028',
  'N00003062',
  'N00003105',
  'N00003132',
  'N00003209',
  'N00003225',
  'N00003280',
  'N00003288',
  'N00003328',
  'N00003389',
  'N00003473',
  'N00003522',
  'N00003535',
  'N00003682',
  'N00003689',
  'N00003813',
  'N00003950',
  'N00004029',
  'N00004118',
  'N00004133',
  'N00004291',
  'N00004357',
  'N00004357',
  'N00004367',
  'N00004403',
  'N00004558',
  'N00004572',
  'N00004614',
  'N00004719',
  'N00004724',
  'N0004874', // FLAG
  'N0004884', // FLAG
  'N00004887',
  'N00004961',
  'N00004981',
  'N00005195',
];
