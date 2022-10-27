// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./external/nibbstack/erc721/src/contracts/tokens/nf-token-metadata.sol";
import "./external/nibbstack/erc721/src/contracts/tokens/erc721-metadata.sol";
import "./external/nibbstack/erc721/src/contracts/ownership/ownable.sol";

error CloneItemAlreadyExists();

contract TestERC721 is NFTokenMetadata, Ownable {
    constructor () {
        nftName = "Test ERC20";
        nftSymbol = "TEST";
        for (uint i; i < 10; i++) {
            super._mint(0x775B572e0CEB816625Af9779Bb686A8b47975876, i);
            super._setTokenUri(i, '<some-data>');
        }
    }
}
