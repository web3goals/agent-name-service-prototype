import { Chain } from "viem";

export type ChainConfig = {
  chain: Chain;
  erc721Address: `0x${string}`;
  erc20Address: `0x${string}`;
  erc20Symbol: string;
  erc20Decimals: number;
  minErc20AmountToMintErc721: bigint;
};
