import {API_ADD, http} from './http';
import {router} from './router';
import {Sector, SectorResponse} from '../types/Sector';

/**
 * Provides sector total of specified politician's receipts
 * @params cid CRP CandidateID
 * @params cycle 2012, 2014, 2016, 2018 (blank or out of range cycle will return most recent cycle)
 */
router.get('/api/candSector', async (req, res) => {

  const cid = req.query.cid;
  const cycle = req.query.cycle;
  let url = `${API_ADD}candSector&cid=${cid}`;
  if (cycle) {
    url += `&cycle=${cycle}`;
  }

  let respRaw;
  try {
    const apiRaw = await http.get(url);
    respRaw = apiRaw.data.response.sectors;
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
    return;
  }

  const resp = {} as SectorResponse;
  for (const key of Object.keys(respRaw['@attributes'])) {
    resp[key] = respRaw['@attributes'][key];
  }

  delete respRaw['@attributes'];
  resp.sector = [];
  for (const secRaw of respRaw.sector) {
    const sector = {};
    for (const key of Object.keys(secRaw['@attributes'])) {
      sector[key] = secRaw['@attributes'][key];
    }
    resp.sector.push(sector as Sector);
  }

  res.json(resp);
});

export {router as candSector};
