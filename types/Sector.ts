import {Candidate} from './Candidate';

export interface SectorResponse {
  // Information about the candidate/member
  sectors: Candidate;
  sector: Sector[];
}

export interface Sector {
  // CRP Sector name [Agribusiness, Communic/Electronics, Construction, Defense,
  // Energy/Nat Resource, Finance/Insur/RealEst, Health, Lawyers & Lobbyists,
  // Transportation, Misc Business, Labor, Ideology/Single-Issue, Other]
  sector_name: string;
  // CRP's sector ID
  sectorid:	string;
  // Total contributed by individuals within sector in cycle
  indivs:	number;
  // Total contributed by pacs within sector in cycle
  pacs:	number;
  // Total itemized contributions attributed
  total: number;
}
