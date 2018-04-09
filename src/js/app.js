App = {
    web3Provider: null,
    contracts: {},
    account: 0x0,

    init: function () {
        return App.initWeb3();
    },

    initWeb3: function () {
        if (typeof web3 !== 'undefined') {
            //reuse the provider of the Web3 object injected by Metamask
            App.web3Provider = web3.currentProvider;
        } else {
            //create a new provider and plug it into our local node
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);
        //console.log(web3.version);

        App.displayAccountInfo();

        return App.initContract();
    },

    displayAccountInfo: function () {
        web3.eth.getCoinbase(function (err, account) {
            if (err === null) {
                App.account = account;
                $('#account').text(account);
                web3.eth.getBalance(account, function (err, balance) {
                    if (err === null) {
                        $('#accountBalance').text(web3.fromWei(balance, "ether") + " ETH");
                    }
                })
            }
        });
    },

    initContract: function () {
        $.getJSON('ChainList.json', function (chainListArtifact) {
            App.contracts.ChainList = TruffleContract(chainListArtifact);
            // set the provicer for our contracts
            App.contracts.ChainList.setProvider(App.web3Provider);
            // retrieve the article from the contract
            return App.reloadArticles();
        });
    },

    reloadArticles: function () {
        // refresh the account information
        App.displayAccountInfo();

        // retrieve the article placeholder and clear it
        $('#articlesRow').empty();

        App.contracts.ChainList.deployed().then(function(instace) {
            return instace.getItem();
        }).then(function (item) {
            if (item[0] === 0x0) {
                // no item to sell is initialized
                return;
            }

            var articleTemplate = $('#articleTemplate');
            articleTemplate.find('.panel-title').text(item[1]);
            articleTemplate.find('.article-description').text(item[2]);
            articleTemplate.find('.article-price').text(web3.fromWei(item[3], "ether") + " ETH");
            
            var sellerAccount = item[0];
            if (sellerAccount === App.account) {
                sellerAccount = "You";
            }
            articleTemplate.find('.article-seller').text(sellerAccount);
            
            // add this article
            $('#articlesRow').append(articleTemplate.html());
        }).catch(function (err) {
            console.error(err.message);
        });
    },

    sellItem: function() {
        var itemName = $('#article_name').val();
        var itemDescription = $('#article_description').val();
        var itemPrice = web3.toWei($('#article_price').val() || 0, "ether");

        if (itemName.trim() === '' || itemPrice === 0)
        {
            return false;
        }

        App.contracts.ChainList.deployed().then(function (instace) {
            return instace.sellItem(itemName, itemDescription, itemPrice, {
                from: App.account,
                gas: 500000
            });
        }).then(function (result) {
            App.reloadArticles();
        }).catch(function (err) {
            console.error(err);
        });
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
