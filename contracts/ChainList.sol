pragma solidity ^0.4.18;

contract ChainList {
    // state variables
    address sellerAddress;
    string itemToSell;
    string description;
    uint256 price;

    function getItem() public view returns 
    (
        address _sellerAddress,
        string _itemToSell,
        string _description,
        uint256 _price
    )
    {
        return (sellerAddress, itemToSell, description, price);
    }

    function sellItem(string _itemToSell, string _description, uint256 _price) public 
    {
        sellerAddress = msg.sender;
        itemToSell = _itemToSell;
        description = _description;
        price = _price;
    }
}