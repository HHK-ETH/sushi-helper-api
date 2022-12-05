import { BigNumber, Contract, providers } from 'ethers';
import {
  BENTO,
  FURO_QUERY,
  FURO_SUBGRAPH,
  MASTERCHEF,
  MERKLE,
  MERKLE2,
  RPC,
  SUSHI_HOUSE,
  SUSHI_TOKEN,
  TREASURY,
} from './constants';
import { BENTO_ABI, ERC20_ABI } from './../imports';
import request from 'graphql-request';

export async function getTotalSupply() {
  const provider = new providers.JsonRpcProvider(RPC);
  const sushiContract = new Contract(SUSHI_TOKEN, ERC20_ABI, provider);
  const supply: BigNumber = await sushiContract.totalSupply();

  const treasuryBalance: BigNumber = await sushiContract.balanceOf(TREASURY);
  const houseBalance: BigNumber = await sushiContract.balanceOf(SUSHI_HOUSE);
  const merkleBalance: BigNumber = await sushiContract.balanceOf(MERKLE);
  const merkle2Balance: BigNumber = await sushiContract.balanceOf(MERKLE2);
  const masterchefBalance: BigNumber = await sushiContract.balanceOf(MASTERCHEF);
  const furoBalance: BigNumber = await queryFuroBalance(provider);

  return supply
    .sub(treasuryBalance)
    .sub(houseBalance)
    .sub(merkleBalance)
    .sub(merkle2Balance)
    .sub(masterchefBalance)
    .sub(furoBalance);
}

async function queryFuroBalance(provider: providers.JsonRpcProvider): Promise<BigNumber> {
  const query = await request(FURO_SUBGRAPH, FURO_QUERY);
  const bentoContract = new Contract(BENTO, BENTO_ABI, provider);
  return await bentoContract.toAmount(SUSHI_TOKEN, query.token.liquidityShares, true);
}
