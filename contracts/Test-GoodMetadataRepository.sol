// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract TestGoodMetadataRepository {
    address public contractAddress;
    uint public tokenId;

    constructor (address _contractAddress, uint _tokenId) {
        contractAddress = _contractAddress;
        tokenId = _tokenId;
    }

    function get () external returns (address, uint) {
        return (contractAddress, tokenId);
    }
}
