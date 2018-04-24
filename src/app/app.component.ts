import { Component } from '@angular/core';
import {OpenSecretsService} from './shared/open-secrets.service';

@Component({
  selector: 'viz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private openSecretsService: OpenSecretsService) {
    this.openSecretsService.candContrib('N00007360')
      .subscribe(console.log);

    this.openSecretsService.candIndByInd('N00007360', 'K02', '2014')
      .subscribe(console.log);

    this.openSecretsService.candIndustry('N00007360')
      .subscribe(console.log);

    this.openSecretsService.candSector('N00007360')
      .subscribe(console.log);

    this.openSecretsService.getLegislators('N00007360')
      .subscribe(console.log);

    this.openSecretsService.getAllLegislators()
      .subscribe(console.log);
  }
}
