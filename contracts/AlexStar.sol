// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract AlexStar is ERC721("Alex Star", "ASTAR"){
    struct Star {
        string name;
        uint256 price;
    }

    mapping(uint256 => Star) private _starCatalog;

    function mintStar(string memory _name, uint256 _price, uint256 _tokenId) public {
        Star memory newStar = Star(_name, _price);
        _starCatalog[_tokenId] = newStar;
        _mint(msg.sender, _tokenId);
    }

    function buyStar(uint256 _tokenId) public payable {
        require(msg.value > 0, "Amount cannot be 0");
        require(msg.value == _getPrice(_tokenId), "Amount must equal star price");

        // Transfer value to star owner
        // (bool success, bytes memory data) = payable(ownerOf(_tokenId)).call{value: msg.value}("");
        // require(success, "Failed to transfer Ether to star owner");
        payable(ownerOf(_tokenId)).transfer(msg.value);

        _transfer(ownerOf(_tokenId), msg.sender, _tokenId);
    }

    function _getPrice(uint256 _tokenId) private view returns (uint256) {
        return _starCatalog[_tokenId].price;
    }
}
