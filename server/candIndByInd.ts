import {API_ADD, http} from './http';
import {router} from './router';

/**
 * Provides total contributed to specified candidate from specified industry.
 * Senate data reflects 2-year totals.
 * @params cid CRP CandidateID
 * @params cycle 2012, 2014, 2016, 2018 (blank or out of range cycle will return most recent cycle)
 * @params ind a 3-character industry code
 */
router.get('/api/candIndByInd', async (req, res) => {

  const cid = req.query.cid;
  const cycle = req.query.cycle;
  const ind = req.query.ind;
  let url = `${API_ADD}candIndByInd&cid=${cid}&ind=${ind}`;
  if (cycle) {
    url += `&cycle=${cycle}`;
  }

  let respRaw;
  try {
    const apiRaw = await http.get(url);
    respRaw = apiRaw.data.response.candIndus;
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
    return;
  }

  const resp = {};

  for (const key of Object.keys(respRaw['@attributes'])) {
    resp[key] = respRaw['@attributes'][key];
  }

  res.json(resp);
});

export {router as candIndByInd};
