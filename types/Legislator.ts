export interface Legislator {
  // CRP ID for legislator
  cid: string;
  // like "Nancy Pelosi"
  firstlast: string;
  // lastname of legislator
  lastname:	string;
  party: string;
  office:	string;
  // M or F
  gender:	string;
  // Year first elected to current office
  firstelectoff: string;
  // Exit code assigned by CRP (see OpenData User's Guide)
  exitcode:	string;
  // generally expounds on exitcode
  comments:	string;
  // office phone number of legislator
  phone: string;
  // office fax number of legislator
  fax: string;
  // legislator's web site
  website: string;
  // form to communicate with legislator
  webform: string;
  // office address
  congress_office: string;
  // ID of a member from the Congressional Bioguide
  bioguide_id: string;
  // VoteSmart ID of member
  votesmart_id:	string;
  // ID of member assigned by Federal Election Commission
  feccandid: string;
  // Twitter id of member
  twitter_id:	string;
  // YouTube id of member
  youtube_url: string;
  // Facebook id of member
  facebook_id: string;
  // member's date of birth (YYYY-MM-DD)
  birthdate: string;
}

export interface LegislatorResponse {
  legislators: Legislator[];
}
