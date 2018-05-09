import { Pipe, PipeTransform } from '@angular/core';
import {Legislator} from '../../../types/Legislator';

@Pipe({
  name: 'marbleParty'
})
export class MarblePartyPipe implements PipeTransform {
  transform(legislators: Legislator[], party: string): any {
    return legislators.filter(p => p.party === party);
  }
}
