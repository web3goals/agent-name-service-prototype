import { getAddress } from "viem";
import { monadTestnet } from "viem/chains";

export const chainConfig = {
  chain: monadTestnet,
  token: getAddress("0x534b2f3A21130d7a60830c2Df862319e593943A3"), // USDC
  minTokenAmountToMintAnsName: BigInt(100_000_000), // 100 USDC with 6 decimals
};
