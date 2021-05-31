// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract AlexStar is ERC721("Alex Star", "ASTAR") {
    struct Star {
        uint256 id;
        string name;
        uint256 price;
        string imageSrc;
    }

    mapping(uint256 => Star) private _starCatalog;
    uint256[] private _tokenIdArray;

    function mintStar(
        string memory _name,
        uint256 _price,
        string memory _imageSrc
    ) public {
        uint256 newTokenId;
        if (_tokenIdArray.length == 0) newTokenId = 1;
        else newTokenId = _tokenIdArray[_tokenIdArray.length - 1] + 1;

        Star memory newStar = Star(newTokenId, _name, _price, _imageSrc);
        _starCatalog[newTokenId] = newStar;
        _tokenIdArray.push(newTokenId);
        _mint(msg.sender, newTokenId);
    }

    function buyStar(uint256 _tokenId) public payable {
        require(msg.value > 0, "Amount cannot be 0");
        require(
            msg.value == _getPrice(_tokenId),
            "Amount must equal star price"
        );

        // Transfer value to star owner
        // Note: the following method is apparently discouraged for security reasons
        // payable(ownerOf(_tokenId)).transfer(msg.value);
        // So the following method is used instead:
        (bool success, bytes memory data) =
            payable(ownerOf(_tokenId)).call{value: msg.value}("");
        require(success, "Failed to transfer Ether to star owner");

        _transfer(ownerOf(_tokenId), msg.sender, _tokenId);
    }

    // Note: this function is just a wrapper for transferFrom, so it's redundant
    function transferStar(address _to, uint256 _tokenId) public {
        //Note: this check is redundant because it's already implemented in transferFrom
        require(
            msg.sender == ownerOf(_tokenId),
            "Transfer caller is not owner of star"
        );

        transferFrom(msg.sender, _to, _tokenId);
    }

    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        address owner1 = ownerOf(_tokenId1);
        address owner2 = ownerOf(_tokenId2);

        require(
            msg.sender == owner1 || msg.sender == owner2,
            "Only the owners of the stars can initiate an exchange"
        );

        transferFrom(owner1, owner2, _tokenId1);
        transferFrom(owner2, owner1, _tokenId2);
    }

    function getAllStars() public view returns (Star[] memory) {
        Star[] memory stars = new Star[](_tokenIdArray.length);
        for (uint256 i = 0; i < _tokenIdArray.length; i++) {
            stars[i] = _starCatalog[_tokenIdArray[i]];
        }
        return stars;
    }

    function getNameById(uint256 _tokenId) public view returns (string memory) {
        return _starCatalog[_tokenId].name;
    }

    function _getPrice(uint256 _tokenId) private view returns (uint256) {
        return _starCatalog[_tokenId].price;
    }
}
