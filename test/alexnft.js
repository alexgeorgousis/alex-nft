const AlexNFT = artifacts.require("./AlexNFT.sol");

contract("AlexNFT", accounts => {
  it("should have correct name", async () => {
    const instance = await AlexNFT.deployed();
    const name = await instance.nftName.call();
    assert.equal(name, "Unique Alex STAR!");
  });

  it("should be claimable", async () => {
    const instance = await AlexNFT.deployed();

    const result = await instance.claimNFT({from: accounts[1]});
    const owner = await instance.owner.call();
    assert.equal(owner, accounts[1]);
  });

  it("should change owners", async () => {
    const instance = await AlexNFT.deployed();

    const result1 = await instance.claimNFT({from: accounts[0]});
    assert.equal(await instance.owner.call(), accounts[0]);

    const result2 = await instance.claimNFT({from: accounts[1]});
    assert.equal(await instance.owner.call(), accounts[1]);
  });

  it("should emit claimed event", async () => {
    const instance = await AlexNFT.deployed();
    const result = await instance.claimNFT({from: accounts[0]});
    assert.equal(result.logs[0].event, "NftClaimed");
  });
});
