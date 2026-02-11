import { getAddress } from "viem";
import { monadTestnet } from "viem/chains";

export const chainConfig = {
  chain: monadTestnet,
  erc721Address: getAddress("0xb6910ef7f1134bc67f8abfe9344e883cdb5f2797"), // ANS
  erc20Address: getAddress("0x534b2f3A21130d7a60830c2Df862319e593943A3"), // USDC
  erc20Symbol: "USDC",
  erc20Decimals: 6,
  minErc20AmountToMintErc721: BigInt(100_000_000), // 100 USDC
};
