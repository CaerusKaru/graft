import {API_ADD, http} from './http';

import {router} from './router';

/**
 * Provides summary fundraising information for specified politician
 * @params cid CRP CandidateID
 * @params cycle 2012, 2014, 2016, 2018 (blank or out of range cycle will return most recent cycle)
 */
router.get('/api/candSummary', async (req, res) => {

  const cid = req.query.cid;
  const cycle = req.query.cycle;
  let url = `${API_ADD}candSummary&cid=${cid}`;
  if (cycle) {
    url += `&cycle=${cycle}`;
  }

  let respRaw;
  try {
    const apiRaw = await http.get(url);
    respRaw = apiRaw.data.response.summary;
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

  res.json(resp);
});

export {router as candSummary};
