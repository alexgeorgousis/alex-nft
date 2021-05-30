const AlexNFT = artifacts.require("./AlexNFT.sol");

contract("AlexNFT", accounts => {

});

it("...should have correct name", async () => {
  const instance = await AlexNFT.deployed();
  const name = await instance.nftName.call();
  assert.equal(name, "Unique Alex STAR!");
});
