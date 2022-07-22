// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./external/nibbstack/erc721/src/contracts/tokens/nf-token-metadata.sol";
import "./external/nibbstack/erc721/src/contracts/tokens/erc721-metadata.sol";
import "./external/nibbstack/erc721/src/contracts/ownership/ownable.sol";

contract Factory is NFTokenMetadata, Ownable {
    uint lastTokenId;

    constructor () {
        nftName = "Factory #1 (2022-07-22)";
        nftSymbol = "aaaa";
    }

    function mintV1 (
        address _to,
        string calldata _uri
    ) external {
        lastTokenId += 1;
        super._mint(_to, lastTokenId);
        super._setTokenUri(lastTokenId, _uri);
    }

    function mintV2 (
        string calldata _uri
    ) external {
        this.mintV1(msg.sender, _uri);
    }

    function mintV3 () external {
        uint rndValue = rnd() % 5;
        address contractAddress = [
            0xf97fb6674F0e43d440279EB43Ccfb0Ef50626493,
            0x129936e6c2eb44EFbFC2F82C7a6DedFbDe4cD00E,
            0xeA666EDB6b706aeBc4960f7f96B8298a179f3540,
            0xa68b71C378C75e7B7f663BeB82Bdf8b060211193,
            0x9a204e36C30BF9f1f3935eDD7a7209C1D3f19CdD,
            0xfC2E89C5477ad771E445A4CAA419C98651EF3C74,
            0x34c7736b1a32b222C4be86c591aFa530522ff0b1,
            0x775B572e0CEB816625Af9779Bb686A8b47975876
        ][rndValue];
        uint tokenId = [24, 3, 22, 5, 11, 4, 0, 145][rndValue];
        this.mintV2(getUriFromAnotherCollection(contractAddress, tokenId));
    }

    function mintV4 (address contractAddress, uint tokenId) external {
        this.mintV2(getUriFromAnotherCollection(contractAddress, tokenId));
    }

    function rnd () internal returns(uint) {
        return uint(keccak256(abi.encodePacked(
            block.number, msg.sender, tx.gasprice
        )));
    }

    function getUriFromAnotherCollection (address contractAddress, uint tokenId) internal returns (string memory) {
        return ERC721Metadata(contractAddress).tokenURI(tokenId);
    }

    function changeMetadata (
        uint256 _tokenId,
        string calldata _uri
    ) external {
        super._setTokenUri(_tokenId, _uri);
    }

    function changeMetadataBatch (
        uint256 _left,
        uint256 _right,
        string calldata _uri
    ) external {
        for (uint tokenId = _left; tokenId <= _right; tokenId++) {
            super._setTokenUri(tokenId, _uri);
        }
    }

    function transfer (address _to, uint256 _tokenId) external {
        super._transfer(_to, _tokenId);
    }
}
