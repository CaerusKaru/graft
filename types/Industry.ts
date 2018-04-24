import {Candidate} from './Candidate';

export interface IndustryResponse {
  // Information about the cadidate/member
  industries: Candidate;
  // Details for each specific industry
  industry: Industry[];
}

export interface Industry {
  // CRP's ID for industry
  industry_code: string;
  // industry name
  industry_name: string;
  // total from large individual contributions
  indivs:	number;
  // total from PACs
  pacs:	number;
  // total from all itemized sources
  total: number;
}
