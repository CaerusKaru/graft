import {Contributor, ContributorResponse} from '../types/Contributor';
import {API_ADD, http} from './http';

import {router} from './router';

/**
 * Returns top contributors to specified candidate for a House or Senate seat or member of Congress.
 * These are 6 year numbers for Senators/Senate candidates; 2 years for Representatives/House candidates
 * @params cid CRP CandidateID
 * @params cycle 2012, 2014, 2016, 2018 (blank or out of range cycle will return most recent cycle)
 */
router.get('/api/candContrib', async (req, res) => {

  const cid = req.query.cid;
  const cycle = req.query.cycle;
  let url = `${API_ADD}candContrib&cid=${cid}`;
  if (cycle) {
    url += `&cycle=${cycle}`;
  }

  let respRaw;
  try {
    const apiRaw = await http.get(url);
    respRaw = apiRaw.data.response.contributors;
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
    return;
  }

  const resp = {};

  for (const key of Object.keys(respRaw['@attributes'])) {
    resp[key] = respRaw['@attributes'][key];
  }

  delete respRaw['@attributes'];
  (resp as ContributorResponse).contributors = [];
  for (const contribRaw of respRaw.contributor) {
    const contrib = {};
    for (const key of Object.keys(contribRaw['@attributes'])) {
      contrib[key] = contribRaw['@attributes'][key];
    }
    (resp as ContributorResponse).contributors.push(contrib as Contributor);
  }

  res.json(resp);
});

export {router as candContrib};
