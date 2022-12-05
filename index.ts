import { formatUnits } from 'ethers/lib/utils';
import express from 'express';
import { getTotalSupply, StorageHelper } from './src';

const app = express();
const port = 3334;

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
