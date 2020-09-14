import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'

dotenv.config();

import { IPingResponse } from './interfaces';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

app.get('/ping', async (req, res) => {
  const response: IPingResponse = {
    pong: 'OK'
  };

  res.send(response);
});

(async () => {
  app.listen(PORT, () => {
    console.log('Started at http://localhost:' + PORT);
  });
})();
