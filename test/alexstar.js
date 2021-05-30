const truffleAssert = require("truffle-assertions");
const AlexStar = artifacts.require("./AlexStar.sol");

contract("AlexStar", accounts => {
    let instance;

    beforeEach(async () => {
        instance = await AlexStar.new();
    });

    it("should have correct symbol", async () => {
        assert.equal(await instance.symbol(), "ASTAR");
    });

    it("should mint new star and send to owner", async () => {
        const _result = await instance.mintStar("ASTAR #1", 0, 1, {from: accounts[1]});
        assert.equal(await instance.ownerOf(1), accounts[1]);
    });

    it("should require value to equal star price", async () => {
        const star = {name: "ASTAR #1", price: 10, id: 1}
        const _dummy1 = await instance.mintStar(star.name, star.price, star.id, {from: accounts[0]});

        await truffleAssert.reverts(
            instance.buyStar(1, {from: accounts[1]}), "Amount cannot be 0"
        );

        await truffleAssert.reverts(
            instance.buyStar(1, {from: accounts[1], value: 8}), "Amount must equal star price"
        );

        const _dummy2 = await instance.buyStar(1, {from: accounts[1], value: 10});
        assert.equal(await instance.ownerOf(1), accounts[1]);
    });

    it("should send value to star owner after purchase", async () => {
        const star = {name: "ASTAR #1", price: 10, id: 1}
        const owner = accounts[0];
        const buyer = accounts[1];

        const _dummy1 = await instance.mintStar(star.name, star.price, star.id, {from: owner}); 

        const ownerInitialBalance = await web3.eth.getBalance(owner);
        const _dummy2 = await instance.buyStar(star.id, {from: buyer, value: star.price});
        const ownerFinalBalance = await web3.eth.getBalance(owner);

        assert.equal(Number(ownerInitialBalance) + star.price, Number(ownerFinalBalance));
    });
});
