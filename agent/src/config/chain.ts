import { getAddress } from "viem";
import { monadTestnet } from "viem/chains";

export const chainConfig = {
  chain: monadTestnet,
  erc721Address: getAddress("0x029d3b73e26571ba56ccc469dea4754630326ffc"), // ANS
  erc20Address: getAddress("0x534b2f3A21130d7a60830c2Df862319e593943A3"), // USDC
  erc20Symbol: "USDC",
  erc20Decimals: 6,
  minErc20AmountToMintErc721: BigInt(100_000_000), // 100 USDC
};
