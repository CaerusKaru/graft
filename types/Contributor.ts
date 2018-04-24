import {BaseCSC} from './Base';

export interface Contributor {
  // organization name
  org_name:	string;
  // total from all itemized sources
  total: number;
  // total PAC contributions
  pacs:	number;
  // total individual contributions
  indivs: number;
}

export interface ContributorResponse extends BaseCSC {
  // formatted Firstname Lastname (Party)
  cand_name: string;
  // CRP's ID
  cid: string;
  // cycle year of data being returned
  cycle: number;
  // required explanatory text - must be displayed with published data
  notice:	string;
  contributors: Contributor[];
}
