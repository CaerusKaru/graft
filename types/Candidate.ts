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
