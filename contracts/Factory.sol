// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./external/nibbstack/erc721/src/contracts/tokens/nf-token-metadata.sol";
import "./external/nibbstack/erc721/src/contracts/tokens/erc721-metadata.sol";
import "./external/nibbstack/erc721/src/contracts/ownership/ownable.sol";

error CloneItemAlreadyExists();

contract Factory is NFTokenMetadata, Ownable {
    uint public lastTokenId;
    address[] public contractAddresses = [
        0xf97fb6674F0e43d440279EB43Ccfb0Ef50626493,
        0x129936e6c2eb44EFbFC2F82C7a6DedFbDe4cD00E,
        0xeA666EDB6b706aeBc4960f7f96B8298a179f3540,
        0xa68b71C378C75e7B7f663BeB82Bdf8b060211193,
        0x9a204e36C30BF9f1f3935eDD7a7209C1D3f19CdD,
        0xfC2E89C5477ad771E445A4CAA419C98651EF3C74,
        0x34c7736b1a32b222C4be86c591aFa530522ff0b1,
        0x775B572e0CEB816625Af9779Bb686A8b47975876
    ];
    uint[] public tokenIds = [24, 3, 22, 5, 11, 4, 0, 145];

    constructor () {
        nftName = "Factory #2 (2022-07-26)";
        nftSymbol = "aaaa";
    }

    function renameContract (string calldata name, string calldata symbol) external {
        nftName = name;
        nftSymbol = symbol;
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
        uint rndValue = rnd() % contractAddresses.length;
        address contractAddress = contractAddresses[rndValue];
        uint tokenId = tokenIds[rndValue];
        this.mintV1(msg.sender, getUriFromAnotherCollection(contractAddress, tokenId));
    }

    function mintV4 (address contractAddress, uint tokenId) external {
        this.mintV1(msg.sender, getUriFromAnotherCollection(contractAddress, tokenId));
    }

    function addMetadataClone (address contractAddress, uint tokenId) external {
        for (uint i; i < contractAddresses.length; i++) {
            if (contractAddresses[i] == contractAddress && tokenIds[i] == tokenId) {
                revert CloneItemAlreadyExists();
            }
        }
        contractAddresses.push(contractAddress);
        tokenIds.push(tokenId);
    }

    function removeMetadataClone (uint index) external {
        contractAddresses[index] = contractAddresses[contractAddresses.length - 1];
        contractAddresses.pop();
        tokenIds[index] = tokenIds[tokenIds.length - 1];
        tokenIds.pop();
    }

    function hashState () external view returns (uint) {
        return uint(keccak256(abi.encodePacked(contractAddresses, tokenIds)));
    }

    function rnd () internal view returns (uint) {
        return uint(keccak256(abi.encodePacked(
            block.number, msg.sender, tx.gasprice
        )));
    }

    function getUriFromAnotherCollection (
        address contractAddress,
        uint tokenId
    ) internal view returns (string memory) {
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
