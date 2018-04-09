var ChainList = artifacts.require("./ChainList.sol");

// test suite
contract('ChainList', function(accounts) {
    var ChainListInstace;
    var sellerAddress = accounts[9];
    var itemToSell = "New item to sell";
    var description = "Some sample description of the item to sell";
    var price = 10;
    

    //init other smart contract properties
    it("should be initialized with empty values", function() {
        return ChainList.deployed().then(function (instance) {
            return instance.getItem();            
        }).then(function (data) {
            assert.equal(data[0], 0x0, "Seller address should be empty");
            assert.equal(data[1], "", "Item should be empty");
            assert.equal(data[2], "", "Description should be empty");
            assert.equal(data[3].toNumber(), 0, "Price should be zero");
        });
    });

    it("should sell an item", function() {
        return ChainList.deployed().then(function (instance) {
            ChainListInstace = instance;
            return ChainListInstace.sellItem(itemToSell, description, web3.toWei(price, "ether"), { from: sellerAddress })
        }).then(function() {
            return ChainListInstace.getItem();
        }).then(function (data) {
            assert.equal(data[0], sellerAddress, "Seller address should be " + sellerAddress);
            assert.equal(data[1], itemToSell, "Item should be " + itemToSell);
            assert.equal(data[2], description, "Description should be " + description);
            assert.equal(data[3].toNumber(), web3.toWei(price, "ether"), "Price should be " + web3.toWei(price, "ether"));
        });
    });

});