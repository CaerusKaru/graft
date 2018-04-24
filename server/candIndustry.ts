import {API_ADD, http} from './http';
import {router} from './router';
import {Industry, IndustryResponse} from '../types/Industry';

/**
 * Provides the top ten industries contributing to a specified candidate for a House or Senate seat or member of Congress.
 * These are 6-year numbers for Senators/Senate candidates; 2-year total for Representatives/House candidates.
 * @params cid CRP CandidateID
 * @params cycle 2012, 2014, 2016, 2018 (blank or out of range cycle will return most recent cycle)
 */
router.get('/api/candIndustry', async (req, res) => {

  const cid = req.query.cid;
  const cycle = req.query.cycle;
  let url = `${API_ADD}candIndustry&cid=${cid}`;
  if (cycle) {
    url += `&cycle=${cycle}`;
  }

  let respRaw;
  try {
    const apiRaw = await http.get(url);
    respRaw = apiRaw.data.response.industries;
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
    return;
  }

  const resp = {} as IndustryResponse;
  for (const key of Object.keys(respRaw['@attributes'])) {
    resp[key] = respRaw['@attributes'][key];
  }

  delete respRaw['@attributes'];
  resp.industry = [];
  for (const indRaw of respRaw.industry) {
    const industry = {};
    for (const key of Object.keys(indRaw['@attributes'])) {
      industry[key] = indRaw['@attributes'][key];
    }
    resp.industry.push(industry as Industry);
  }

  res.json(resp);
});

export {router as candIndustry};
