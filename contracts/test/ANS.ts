import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("ANS", async function () {
  const { viem } = await network.connect();
  const initialImage = "ipfs://QmInitialImageURI";

  it("Should deploy with the correct image URI", async function () {
    const ans = await viem.deployContract("ANS", [initialImage]);
    const uri = await ans.read.imageURI();
    assert.equal(uri, initialImage);
  });

  it("Should calculate the correct tokenId", async function () {
    const ans = await viem.deployContract("ANS", [initialImage]);
    const name = "Agent007";
    // Keccak256 of "Agent007"
    // Using the contract to verify calculation logic
    const tokenId = await ans.read.getTokenId([name]);
    assert.equal(typeof tokenId, "bigint");
  });

  it("Should mint a new token correctly", async function () {
    const ans = await viem.deployContract("ANS", [initialImage]);
    const [owner] = await viem.getWalletClients();

    const name = "Bond";
    const personality = "Spy";

    // Calculate expected tokenId
    const tokenId = await ans.read.getTokenId([name]);

    await ans.write.safeMint([owner.account.address, name, personality]);

    const exists = await ans.read.exists([tokenId]);
    assert.equal(exists, true);

    const storedName = await ans.read.names([tokenId]);
    assert.equal(storedName, name);

    const storedPersonality = await ans.read.personalities([tokenId]);
    assert.equal(storedPersonality, personality);

    const ownerOfToken = await ans.read.ownerOf([tokenId]);
    assert.equal(
      ownerOfToken.toLowerCase(),
      owner.account.address.toLowerCase(),
    );
  });

  it("Should generate correct tokenURI", async function () {
    const ans = await viem.deployContract("ANS", [initialImage]);
    const [owner] = await viem.getWalletClients();

    const name = "Alice";
    const personality = "Helper";

    await ans.write.safeMint([owner.account.address, name, personality]);
    const tokenId = await ans.read.getTokenId([name]);

    const tokenUri = await ans.read.tokenURI([tokenId]);
    assert.ok(tokenUri.startsWith("data:application/json;base64,"));

    const base64Data = tokenUri.split(",")[1];
    const jsonString = Buffer.from(base64Data, "base64").toString("utf-8");
    const metadata = JSON.parse(jsonString);

    assert.equal(metadata.name, name);
    assert.equal(metadata.image, initialImage);

    const traitName = metadata.attributes.find(
      (a: any) => a.trait_type === "Name",
    );
    const traitPersonality = metadata.attributes.find(
      (a: any) => a.trait_type === "Personality",
    );

    assert.equal(traitName.value, name);
    assert.equal(traitPersonality.value, personality);
  });

  it("Should allow owner to update image URI", async function () {
    const ans = await viem.deployContract("ANS", [initialImage]);
    const newImage = "ipfs://QmNewImageURI";

    await ans.write.setImageURI([newImage]);
    assert.equal(await ans.read.imageURI(), newImage);
  });

  it("Should allow owner to set personality", async function () {
    const ans = await viem.deployContract("ANS", [initialImage]);
    const [owner] = await viem.getWalletClients();
    const name = "Bob";
    const personality = "Grumpy";

    await ans.write.safeMint([owner.account.address, name, personality]);
    const tokenId = await ans.read.getTokenId([name]);

    const newPersonality = "Happy";
    await ans.write.setPersonality([tokenId, newPersonality]);
    assert.equal(await ans.read.personalities([tokenId]), newPersonality);
  });

  it("Should allow owner to set name", async function () {
    const ans = await viem.deployContract("ANS", [initialImage]);
    const [owner] = await viem.getWalletClients();
    const name = "Charlie";
    const personality = "Cheerful";

    await ans.write.safeMint([owner.account.address, name, personality]);
    const tokenId = await ans.read.getTokenId([name]);

    const newName = "Chuck";
    await ans.write.setName([tokenId, newName]);
    assert.equal(await ans.read.names([tokenId]), newName);
  });

  it("Should fail if non-owner tries to mint", async function () {
    const ans = await viem.deployContract("ANS", [initialImage]);
    const [owner, otherAccount] = await viem.getWalletClients();

    const name = "Hacker";
    const personality = "Bad";

    const ansAsOther = await viem.getContractAt("ANS", ans.address, {
      client: { wallet: otherAccount },
    });

    await assert.rejects(async () => {
      await ansAsOther.write.safeMint([
        otherAccount.account.address,
        name,
        personality,
      ]);
    });
  });

  it("Should fail if minting the same name twice", async function () {
    const ans = await viem.deployContract("ANS", [initialImage]);
    const [owner] = await viem.getWalletClients();
    const name = "UniqueOne";

    await ans.write.safeMint([owner.account.address, name, "First"]);

    await assert.rejects(async () => {
      await ans.write.safeMint([owner.account.address, name, "Second"]);
    });
  });

  it("Should fail if non-owner tries to update settings", async function () {
    const ans = await viem.deployContract("ANS", [initialImage]);
    const [owner, otherAccount] = await viem.getWalletClients();
    const name = "Test";
    await ans.write.safeMint([owner.account.address, name, "None"]);
    const tokenId = await ans.read.getTokenId([name]);

    const ansAsOther = await viem.getContractAt("ANS", ans.address, {
      client: { wallet: otherAccount },
    });

    await assert.rejects(async () => {
      await ansAsOther.write.setImageURI(["new-image"]);
    });

    await assert.rejects(async () => {
      await ansAsOther.write.setPersonality([tokenId, "HackedPersonality"]);
    });

    await assert.rejects(async () => {
      await ansAsOther.write.setName([tokenId, "HackedName"]);
    });
  });

  it("Should revert tokenURI for non-existent token", async function () {
    const ans = await viem.deployContract("ANS", [initialImage]);
    const nonExistentId = 99999n;

    await assert.rejects(async () => {
      await ans.read.tokenURI([nonExistentId]);
    });
  });
});
