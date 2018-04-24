import * as express from 'express';
import * as bodyParser from 'body-parser';
import {candContrib} from './server/candContrib';
import {candIndByInd} from './server/candIndByInd';
import {candIndustry} from './server/candIndustry';
import {candSector} from './server/candSector';
import {getLegislators} from './server/getLegislators';

const PORT = process.env.FRONTEND_PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Routes for API
app.use(candContrib);
app.use(candIndByInd);
app.use(candIndustry);
app.use(candSector);
app.use(getLegislators);

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
