import {BaseCSC} from './Base';

export interface Candidate extends BaseCSC {
  // formatted as Firstname Lastname (Party)
  cand_name: string;
  // CRP's ID
  cid: string;
  // 2012, 2014, 2016
  cycle: string;
  // date data was retrieved from government source(s) (MM/DD/YYYY)
  last_updated:	string;
}

export interface CandidateSummary extends Candidate {
  // two character abbreviation
  state: string;
  // D, R, 3, L, U for Dem, Repub, 3rd party, Libertarian, Unknown
  party: string;
  // S, H, D or blank
  chamber: string;
  // for members only, year first elected to current office
  first_elected: string;
  // for members only, year of next election
  next_election: string;
  // total receipts reported by candidate
  total: number;
  // total expenditures reported by candidate
  spent: number;
  // cash on hand as reported by candidate
  cash_on_hand:	number;
  // debts reported by candidate
  debt:	number;
}
