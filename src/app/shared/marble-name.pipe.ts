import { Pipe, PipeTransform } from '@angular/core';
import {Legislator} from '../../../types/Legislator';

@Pipe({
  name: 'marbleName'
})
export class MarbleNamePipe implements PipeTransform {

  transform(legislators: Legislator[], name: string): any {
    if (!name) {
      return legislators;
    }
    const search = name.toLowerCase();
    return legislators.filter(p => !name || p.firstlast.toLowerCase().indexOf(search) > -1);
  }

}
