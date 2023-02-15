import menu from '@sushiswap/default-token-list';

export function parseMenuByChain(): Record<string, string[]> {
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
