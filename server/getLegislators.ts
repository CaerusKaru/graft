import {API_ADD, http} from './http';
import {router} from './router';
import {Sector, SectorResponse} from '../types/Sector';
import {Legislator, LegislatorResponse} from '../types/Legislator';

/**
 * Provides a list of 115th Congressional legislators and associated attributes for specified
 * subset (state or specific CID)
 * @params id two character state code or specific CID
 */
router.get('/api/getLegislators', async (req, res) => {

  const id = req.query.id;
  const url = `${API_ADD}candSector&id=${id}`;

  let respRaw;
  try {
    const apiRaw = await http.get(url);
    respRaw = apiRaw.data.response;
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
    return;
  }

  const resp = {} as LegislatorResponse;
  resp.legislators = [];

  for (const legLaw of respRaw.legislator) {
    const legislator = {};
    for (const key of Object.keys(legLaw['@attributes'])) {
      legislator[key] = legLaw['@attributes'][key];
    }
    resp.legislators.push(legislator as Legislator);
  }

  res.json(resp);
});

export {router as getLegislators};
