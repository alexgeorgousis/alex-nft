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
        const _result = await instance.mintStar("ASTAR #1", 0, { from: accounts[1] });
        assert.equal(await instance.ownerOf(1), accounts[1]);
    });

    it("should require value to equal star price", async () => {
        const star = { name: "ASTAR #1", price: 10, id: 1 }
        const _dummy1 = await instance.mintStar(star.name, star.price, { from: accounts[0] });

        await truffleAssert.reverts(
            instance.buyStar(star.id, { from: accounts[1] }), "Amount cannot be 0"
        );

        await truffleAssert.reverts(
            instance.buyStar(star.id, { from: accounts[1], value: 8 }), "Amount must equal star price"
        );

        const _dummy2 = await instance.buyStar(star.id, { from: accounts[1], value: 10 });
        assert.equal(await instance.ownerOf(star.id), accounts[1]);
    });

    it("should send value to star owner after purchase", async () => {
        const star = { name: "ASTAR #1", price: web3.utils.toWei('10', 'ether'), id: 1 }
        const owner = accounts[0];
        const buyer = accounts[1];

        const _dummy1 = await instance.mintStar(star.name, star.price, { from: owner });

        const ownerInitialBalance = await web3.eth.getBalance(owner);
        const _dummy2 = await instance.buyStar(star.id, { from: buyer, value: star.price });
        const ownerFinalBalance = await web3.eth.getBalance(owner);

        assert.equal(Number(ownerInitialBalance) + Number(star.price), Number(ownerFinalBalance));
    });

    it("should return star catalog", async () => {
        const star1 = { name: "ASTAR #1", price: 10, id: 1 }
        const star2 = { name: "ASTAR #2", price: 15, id: 2 }
        const star3 = { name: "ASTAR #3", price: 20, id: 3 }

        const _dummy1 = await instance.mintStar(star1.name, star1.price, { from: accounts[0] });
        const _dummy2 = await instance.mintStar(star2.name, star2.price, { from: accounts[0] });
        const _dummy3 = await instance.mintStar(star3.name, star3.price, { from: accounts[0] });

        const starCatalog = await instance.getAllStars();
        assert.equal(starCatalog[0][0], star1.id);
        assert.equal(starCatalog[0][1], star1.name);
        assert.equal(starCatalog[0][2], star1.price.toString());

        assert.equal(starCatalog[1][0], star2.id);
        assert.equal(starCatalog[1][1], star2.name);
        assert.equal(starCatalog[1][2], star2.price.toString());

        assert.equal(starCatalog[2][0], star3.id);
        assert.equal(starCatalog[2][1], star3.name);
        assert.equal(starCatalog[2][2], star3.price.toString());
    });
});
