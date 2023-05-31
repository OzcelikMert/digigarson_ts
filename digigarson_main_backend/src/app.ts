import express from "express";
import config from "config";
import log from "./logger";
import connect from "./db/connect";
import routes from "./router";
var cors = require('cors')
import { deserializeUser } from "./middleware";
import { allowOrigin } from "./middleware";
import bodyParser from "body-parser"
const port = config.get("port") as number;
const host = config.get("host") as string;

import "./library/variable/array"
import "./library/variable/string"
import "./library/variable/number"
import "./library/variable/date"
import "./library/variable/math"

const app = express();
app.use(deserializeUser);
// to prevent CORS error
app.use(cors())

app.use(allowOrigin);

app.use(express.json({limit: '50mb'}));

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.listen(port, host, () => {
  log.info(`Server test listing at http://${host}:${port}`);
  connect();
  app.use(express.static('public'))
  app.use('/v1',routes);
});