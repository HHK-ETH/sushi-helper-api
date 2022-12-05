import { formatUnits } from 'ethers/lib/utils';
import express from 'express';
import { getTotalSupply, StorageHelper } from './src';
import rateLimit from 'express-rate-limit';

const app = express();
const port = 3334;

const limiter = rateLimit({
  windowMs: 120_000, // 2 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 10 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

const storageHelper = StorageHelper.getInstance();

getTotalSupply().then(async (supply) => {
  await storageHelper.write(supply);
  setInterval(async () => {
    console.log('ok');
    await storageHelper.write(await getTotalSupply());
  }, 3600_000); //every 1 hour
});

app.get('/', async (req, res) => {
  const supply = await storageHelper.read();
  res.json({ supply: formatUnits(supply.supply, 18) });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
