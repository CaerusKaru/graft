import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ContributorResponse} from '../../../types/Contributor';
import {Observable, forkJoin, of as observableOf} from 'rxjs';
import {CandidateIndustry} from '../../../types/CandidateIndustry';
import {IndustryResponse} from '../../../types/Industry';
import {SectorResponse} from '../../../types/Sector';
import {LegislatorResponse} from '../../../types/Legislator';
import {STATE_CODES} from './states';
import {CandidateSummary} from '../../../types/Candidate';
import {catchError} from 'rxjs/operators';

const API_URL = '/api/';

@Injectable({providedIn: 'root'})
export class OpenSecretsService {

  constructor(private http: HttpClient) { }

  /**
   * Returns top contributors to specified candidate for a House or Senate seat or member of Congress.
   * These are 6 year numbers for Senators/Senate candidates; 2 years for Representatives/House candidates
   * @params cid CRP CandidateID
   * @params cycle 2012, 2014, 2016, 2018 (blank or out of range cycle will return most recent cycle)
   */
  candContrib(cid: string, cycle?: string): Observable<ContributorResponse> {
    const method = 'candContrib';
    let url = `${API_URL}${method}?cid=${cid}`;
    if (cycle) {
      url += `&cycle=${cycle}`;
    }
    return this.http.get<ContributorResponse>(url);
  }

  /**
   * Returns top contributors to specified candidates
   * These are 6 year numbers for Senators/Senate candidates; 2 years for Representatives/House candidates
   * @param cids list of ids to get summaries for
   * @param cycle the cycle for the summary
   * @returns an observable for the list of summaries
   */
  getAllContribs(cids: string[], cycle?: string): Observable<ContributorResponse[]> {
    const contribRequest = (cid: string) => this.candContrib(cid, cycle).pipe(catchError(res => observableOf({} as ContributorResponse)));
    const contribRequests = cids.map(contribRequest);
    return forkJoin(contribRequests);
  }

  /**
   * Provides summary fundraising information for specified politician
   * @params cid CRP CandidateID
   * @params cycle 2012, 2014, 2016, 2018 (blank or out of range cycle will return most recent cycle)
   */
  candSummary(cid: string, cycle?: string): Observable<CandidateSummary> {
    const method = 'candSummary';
    let url = `${API_URL}${method}?cid=${cid}`;
    if (cycle) {
      url += `&cycle=${cycle}`;
    }
    return this.http.get<CandidateSummary>(url);
  }

  /**
   * Provides summary fundraising information for the specified politicians
   * @param cids list of ids to get summaries for
   * @param cycle the cycle for the summary
   * @returns an observable for the list of summaries
   */
  getAllSummaries(cids: string[], cycle?: string): Observable<CandidateSummary[]> {
    const summaryRequest = (cid: string) => this.candSummary(cid, cycle);
    const summaryRequests = cids.map(summaryRequest);
    return forkJoin(summaryRequests);
  }

  /**
   * Provides total contributed to specified candidate from specified industry.
   * Senate data reflects 2-year totals.
   * @params cid CRP CandidateID
   * @params cycle 2012, 2014, 2016, 2018 (blank or out of range cycle will return most recent cycle)
   * @params ind a 3-character industry code
   */
  candIndByInd(cid: string, ind: string, cycle?: string): Observable<CandidateIndustry> {
    const method = 'candIndByInd';
    let url = `${API_URL}${method}?cid=${cid}&ind=${ind}`;
    if (cycle) {
      url += `&cycle=${cycle}`;
    }
    return this.http.get<CandidateIndustry>(url);
  }


  /**
   * Provides the top ten industries contributing to a specified candidate for a House or Senate seat or member of Congress.
   * These are 6-year numbers for Senators/Senate candidates; 2-year total for Representatives/House candidates.
   * @params cid CRP CandidateID
   * @params cycle 2012, 2014, 2016, 2018 (blank or out of range cycle will return most recent cycle)
   */
  candIndustry(cid: string, cycle?: string): Observable<IndustryResponse> {
    const method = 'candIndustry';
    let url = `${API_URL}${method}?cid=${cid}`;
    if (cycle) {
      url += `&cycle=${cycle}`;
    }
    return this.http.get<IndustryResponse>(url);
  }

  /**
   * Provides sector total of specified politician's receipts
   * @params cid CRP CandidateID
   * @params cycle 2012, 2014, 2016, 2018 (blank or out of range cycle will return most recent cycle)
   */
  candSector(cid: string, cycle?: string): Observable<SectorResponse> {
    const method = 'candSector';
    let url = `${API_URL}${method}?cid=${cid}`;
    if (cycle) {
      url += `&cycle=${cycle}`;
    }
    return this.http.get<SectorResponse>(url);
  }

  /**
   * Provides a list of 115th Congressional legislators and associated attributes for specified
   * subset (state or specific CID)
   * @params id two character state code or specific CID
   */
  getLegislators(id: string): Observable<LegislatorResponse> {
    const method = 'getLegislators';
    const url = `${API_URL}${method}?id=${id}`;
    return this.http.get<LegislatorResponse>(url);
  }

  /** Provides a list of all 115th Congressional legislators and associated attributes */
  getAllLegislators(): Observable<LegislatorResponse[]> {
    const stateRequest = (state: string) => this.getLegislators(state);
    const stateRequests = STATE_CODES.map(stateRequest);
    return forkJoin(stateRequests);
  }

  /**
   * Provides a list of all 115th Congressional legislators and associated attributes
   * WITHOUT a server call
   */
  getAllLegislatorsLocal(): Observable<LegislatorResponse> {
    return this.http.get<LegislatorResponse>('assets/legislators.json');
  }

  getSummariesLocal(cycle: string): Observable<CandidateSummary[]> {
    return this.http.get<CandidateSummary[]>(`assets/summaries.${cycle}.json`);
  }

  getContribsLocal(cycle: string): Observable<ContributorResponse[]> {
    return this.http.get<ContributorResponse[]>(`assets/contrib.${cycle}.json`);
  }
}
