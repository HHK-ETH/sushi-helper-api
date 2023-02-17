import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { getTotalSupply, getAllTokensByChain } from './src';
import rateLimit from 'express-rate-limit';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3335;

const limiter = rateLimit({
  windowMs: Number(process.env.WINDOW), // 2 minutes
  max: Number(process.env.MAX), // Limit each IP to 10 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

//menu routine
let memoryMenu: Record<string, string[]> = {};
getAllTokensByChain().then((menu) => {
  memoryMenu = menu;
  setInterval(async () => {
    memoryMenu = await getAllTokensByChain();
  }, 3600_000); //every 1 hour
});

//supply routine
let memorySupply = {
  circulating: '0',
  total: '0',
};
getTotalSupply().then((supply) => {
  memorySupply = supply;
  setInterval(async () => {
    memorySupply = await getTotalSupply();
  }, 3600_000); //every 1 hour
});

app.get('/supply', async (req, res) => {
  res.json(memorySupply);
});

app.get('/tokens/:id', async (req, res) => {
  res.json(memoryMenu[req.params.id] ? memoryMenu[req.params.id] : []);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
