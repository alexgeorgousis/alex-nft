// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract AlexNFT {
    string public nftName;
    address public owner;
    
    constructor(string memory _nftName) {
        nftName = _nftName;
    }
    
    event nftClaimed(address owner);
    
    function claimNFT() public {
        owner = msg.sender;
        emit nftClaimed(owner);
    }
}
