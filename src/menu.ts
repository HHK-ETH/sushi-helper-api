import menu from '@sushiswap/default-token-list';
import axios from 'axios';
import { ONE_INCH_TOKENS } from '../imports';

const SUSHI_TOKEN_API = 'https://tokens.sushi.com/v0/';
const ONEINCH_TOKEN_API = 'https://tokens.1inch.io/v1.1/';

function parseMenuByChain(): Record<string, string[]> {
  let parsedMenu: Record<string, string[]> = { '1': [] };
  menu.tokens.map((token) => {
    if (parsedMenu[token.chainId]) {
      parsedMenu[token.chainId].push(token.address);
    } else {
      parsedMenu[token.chainId] = [token.address];
    }
  });

  return parsedMenu;
}

async function queryAndParseSushiApi(chains: string[]): Promise<Record<string, string[]>> {
  let parsedList: Record<string, string[]> = { '1': [] };
  await Promise.all(
    chains.map(async (chain) => {
      try {
        const res = await axios.get(SUSHI_TOKEN_API + chain);
        res.data.map((token: any) => {
          if (parsedList[chain]) {
            parsedList[chain].push(token.address);
          } else {
            parsedList[chain] = [token.address];
          }
        });
      } catch (error) {
        parsedList[chain] = [];
      }
    })
  );
  return parsedList;
}

async function queryAndParseOneInchApi(chains: string[]): Promise<Record<string, string[]>> {
  let parsedList: Record<string, string[]> = { '1': [] };
  await Promise.all(
    chains.map(async (chain) => {
      try {
        const res = await axios.get(ONEINCH_TOKEN_API + chain);
        Object.keys(res?.data).map((token: string) => {
          if (parsedList[chain]) {
            parsedList[chain].push(token);
          } else {
            parsedList[chain] = [token];
          }
        });
      } catch (error) {
        parsedList[chain] = [];
      }
    })
  );
  return parsedList;
}

export async function getAllTokensByChain(): Promise<Record<string, string[]>> {
  const base = parseMenuByChain();
  const chains = Object.keys(base);

  //get sushi token list and add it
  const sushiTokens = await queryAndParseSushiApi(chains);
  for (const [chain, tokens] of Object.entries(sushiTokens)) {
    base[chain] = base[chain].concat(...tokens);
  }
  //get oneInch token list and add it, use local json instead of API as they block datacenter requests
  for (const [chain, tokens] of Object.entries(ONE_INCH_TOKENS)) {
    base[chain] = base[chain].concat(...tokens);
  }

  //remove duplicate
  for (const chain of Object.keys(base)) {
    base[chain] = [...new Set(base[chain])];
  }

  return base;
}
