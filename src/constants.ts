import { gql } from 'graphql-request';

export const SUSHI_TOKEN = '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2';
export const BENTO = '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966';

export const TREASURY = '0xe94B5EEC1fA96CEecbD33EF5Baa8d00E4493F4f3';
export const SUSHI_HOUSE = '0x7b18913D945242A9c313573E6c99064cd940c6aF';
export const MASTERCHEF = '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd';
export const MERKLE = '0x1026cbed7b7E851426b959BC69dcC1bf5876512d';
export const MERKLE2 = '0xcBE6B83e77cdc011Cc18F6f0Df8444E5783ed982';

export const FURO_SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/sushi-subgraphs/furo-ethereum';

export const FURO_QUERY = gql`
  query sushiBalance {
    token(id: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2") {
      id
      liquidityShares
    }
  }
`;

export const RPC = 'https://rpc.ankr.com/eth';
