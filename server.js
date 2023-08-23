// SIMPLE SIMULATE API SERVER
require('dotenv').config();
const os = require('os');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();
app.use(bodyParser.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
  })
);

const basePath = process.env.BACKEND_PATH || '/api';
const apis = require('./server.apis');
app.use(basePath, apis);
const port = process.env.BACKEND_PORT || 8000;
app.listen(port, () => {
  const ansiGreenColor = '\x1b[32m%s\x1b[0m';
  console.log(ansiGreenColor, `[Backend] listen on the [http://localhost:${port}${basePath}]`);
});
