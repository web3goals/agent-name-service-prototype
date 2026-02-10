# Contracts

### Commands

- Install dependencies - `npm install`
- Clean the project - `npx hardhat clean`
- Run tests - `npx hardhat test`
- Run tests (nodejs) - `npx hardhat test nodejs`
- Make a deployment - `npx hardhat ignition deploy ignition/modules/Counter.ts --network sepolia`
- Run a script - `npx hardhat run scripts/script.ts --network sepolia`
- Verify a contract - `npx hardhat verify 0x0000000000000000000000000000000000000000 --network sepolia`
- List all keys in the keystore - `npx hardhat keystore list`
- Set a new value in the keystore - `npx hardhat keystore set SEPOLIA_RPC_URL`
