import express from 'express';
import { getTotalSupply, parseMenuByChain } from './src';
import rateLimit from 'express-rate-limit';

const app = express();
const port = 3335;

const limiter = rateLimit({
  windowMs: 120_000, // 2 minutes
  max: 10, // Limit each IP to 10 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

const MENU = parseMenuByChain();

let memorySupply = {
  circulating: '0',
  total: '0',
};
getTotalSupply().then(async (supply) => {
  memorySupply = supply;
  setInterval(async () => {
    memorySupply = await getTotalSupply();
    console.log('Supply at ' + Date.now() + ' : ' + memorySupply);
  }, 3600_000); //every 1 hour
});

app.get('/supply', async (req, res) => {
  res.json(memorySupply);
});

app.get('/tokens', async (req, res) => {
  res.json(MENU);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
