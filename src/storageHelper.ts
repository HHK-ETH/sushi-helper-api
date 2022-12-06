import { BigNumber } from 'ethers';
import fs from 'fs';
import fsPromise from 'fs/promises';

export default class StorageHelper {
  private static instance: StorageHelper;

  private constructor() {
    fs.access('./src/storage.json', fs.constants.R_OK, (err) => {
      if (!err) return;
      const storage: any = { cirulating: '0', total: '0' };
      fs.writeFile('./src/storage.json', JSON.stringify(storage), (err) => {
        if (!err) return;
        console.log(err);
        throw Error('Impossible to open nor create storage.json.');
      });
    });
  }

  public static getInstance(): StorageHelper {
    if (StorageHelper.instance === undefined) {
      StorageHelper.instance = new StorageHelper();
    }
    return StorageHelper.instance;
  }

  public async read(): Promise<{ cirulating: string; total: string }> {
    const supply = await fsPromise.readFile('./src/storage.json', 'utf-8');
    return JSON.parse(supply);
  }

  public async write(supply: { circulating: string; total: string }): Promise<void> {
    await fsPromise.writeFile('./src/storage.json', JSON.stringify(supply));
  }
}
