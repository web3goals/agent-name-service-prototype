import { network } from "hardhat";

async function main() {
  console.log("Deploying ANS contract...");

  const { viem, networkName } = await network.connect();
  console.log("Network name:", networkName);

  const [deployer] = await viem.getWalletClients();
  console.log("Deployer address:", deployer.account.address);

  const contract = await viem.deployContract("ANS", [
    "ipfs://bafkreifullys6tbo5fkoh4l7xfpr7zstfjbgaauwu4bsbo2f4cn7vi3gfq",
  ]);
  console.log("Contract address:", contract.address);

  console.log("ANS contract deployed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
