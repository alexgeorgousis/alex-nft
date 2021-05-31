const truffleAssert = require("truffle-assertions");
const AlexStar = artifacts.require("./AlexStar.sol");

contract("AlexStar", accounts => {
    let instance;

    beforeEach(async () => {
        instance = await AlexStar.new();
    });

    it("should have correct name and symbol", async () => {
        assert.equal(await instance.name(), "Alex Star");
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

    it("should retrieve star name by ID", async () => {
        const star = { name: "ASTAR #1", price: 10, id: 1 };
        const _dummy = await instance.mintStar(star.name, star.price, { from: accounts[0] });

        const retrievedName = await instance.getNameById(star.id);
        assert.equal(retrievedName, star.name);
    });

    it("should exchange stars between two users", async () => {
        const user1 = accounts[0];
        const user2 = accounts[1];

        const star1 = { name: "ASTAR #1", price: 10, id: 1 };
        const star2 = { name: "ASTAR #2", price: 15, id: 2 };

        const _dummy1 = await instance.mintStar(star1.name, star1.price, { from: user1 });
        const _dummy2 = await instance.mintStar(star2.name, star2.price, { from: user2 });

        // user2 needs to approve user1 to transfer user2's star 
        const _dummy3 = await instance.approve(user1, star2.id, { from: user2 });
        const _dummy4 = await instance.exchangeStars(star1.id, star2.id, { from: user1 });

        const ownerStar1 = await instance.ownerOf(star1.id);
        const ownerStar2 = await instance.ownerOf(star2.id);

        assert.equal(ownerStar1, user2);
        assert.equal(ownerStar2, user1);
    });

    it("should revert if exchange caller is not owner", async () => {
        const user1 = accounts[0];
        const user2 = accounts[1];
        const user3 = accounts[2];

        const star1 = { name: "ASTAR #1", price: 10, id: 1 };
        const star2 = { name: "ASTAR #2", price: 15, id: 2 };

        const _dummy1 = await instance.mintStar(star1.name, star1.price, { from: user1 });
        const _dummy2 = await instance.mintStar(star2.name, star2.price, { from: user2 });

        // user2 approves user1 to make the exchange, but not user3 
        const _dummy3 = await instance.approve(user1, star2.id, { from: user2 });

        await truffleAssert.reverts(
            instance.exchangeStars(star1.id, star2.id, { from: user3 }),
            "Only the owners of the stars can initiate an exchange"
        );
    });

    it("should transfer star", async () => {
        const sender = accounts[0];
        const receiver = accounts[1];

        const star = { name: "ASTAR #1", price: 10, id: 1 };
        const _dummy1 = await instance.mintStar(star.name, star.price, { from: sender });

        const _dummy2 = await instance.transferStar(receiver, star.id, { from: sender });
        assert.equal(await instance.ownerOf(star.id), receiver);
    });

    it("should revert transfer if sender is not owner", async () => {
        const owner = accounts[0];
        const thief = accounts[1];

        const star = { name: "ASTAR #1", price: 10, id: 1 };
        const _dummy1 = await instance.mintStar(star.name, star.price, { from: owner });

        await truffleAssert.reverts(instance.transferStar(thief, star.id, { from: thief }), "")
    });
});
