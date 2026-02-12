import { getAddress, parseUnits } from "viem";
import { monad, monadTestnet } from "viem/chains";
import { ChainConfig } from "../types/config";

// @ts-ignore: TS6133
const chainConfigTestnet: ChainConfig = {
  chain: monadTestnet,
  erc721Address: getAddress("0xb6910ef7f1134bc67f8abfe9344e883cdb5f2797"), // ANS
  erc20Address: getAddress("0x534b2f3A21130d7a60830c2Df862319e593943A3"), // USDC
  erc20Symbol: "USDC",
  erc20Decimals: 6,
  minErc20AmountToMintErc721: parseUnits("100", 6), // 100 USDC
};

const chainConfigMainnet: ChainConfig = {
  chain: monad,
  erc721Address: getAddress("0xed3c8bc34b29d1fd9b5a7e8935730d98920187a1"), // ANS
  erc20Address: getAddress("0xB31e1c705eE3A1D4D458C61694DD75512e337777"), // ANS
  erc20Symbol: "ANS",
  erc20Decimals: 18,
  minErc20AmountToMintErc721: parseUnits("50000", 18), // 50000 ANS
};

export const chainConfig = chainConfigMainnet;
