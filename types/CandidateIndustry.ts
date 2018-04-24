import {BaseCSC} from './Base';

export interface CandidateIndustry extends BaseCSC {
  // formatted as lastname, firstname
  cand_name: string;
  // CRP's candidate ID
  cid: string;
  // cycle being returned
  cycle: string;
  // name of industry
  industry: string;
  // H or S (for House or Senate)
  chamber: string;
  // D, R, 3, L, U for Dem, Repub, 3rd party, Libertarian, Unknown
  party: string;
  // full state name
  state: string;
  // individual total + PACs total
  total: number;
  // total from individuals
  indivs: number;
  // total from PACs
  pacs: number;
  // rank within chamber for this member
  rank: string;
  // date source data retrieved from government source(s) (MM/DD/YY)
  last_updated: string;
}
