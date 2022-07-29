// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "./external/nibbstack/erc721/src/contracts/tokens/nf-token-metadata.sol";
import "./external/nibbstack/erc721/src/contracts/tokens/erc721-metadata.sol";
import "./external/nibbstack/erc721/src/contracts/ownership/ownable.sol";

error CloneItemAlreadyExists();

contract Factory is NFTokenMetadata, Ownable {
    bytes16 private constant _HEX_SYMBOLS = "0123456789abcdef";

    bytes4 private constant SEARCH = "{id}";
    uint private constant SEARCH_LENGTH = 4;

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
        nftName = "Factory #3 (2022-07-29)";
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
    ) internal returns (string memory) {
        try ERC721Metadata(contractAddress).tokenURI(tokenId) returns (string memory result) {
            return result;
        } catch {
            string memory result = IERC1155MetadataURI(contractAddress).uri(tokenId);
            return this.replaceIdInString(result, tokenId);
        }
    }

    function replaceIdInString (string memory _uri, uint tokenId) external view returns (string memory) {
        bytes memory uri = bytes(_uri);
        for (uint i; i <= uri.length - SEARCH_LENGTH; i++) {
            uint j;
            for (; j < SEARCH_LENGTH && uri[i+j] == SEARCH[j]; j++) {}
            if (j == SEARCH_LENGTH) {
                bytes memory formatted = this.formatTokenId(tokenId);
                bytes memory tempBytes = new bytes(uri.length - 4 + formatted.length);
                for (uint k; k < i; k++) {
                    tempBytes[k] = uri[k];
                }
                for (uint k; k < formatted.length; k++) {
                    tempBytes[i + k] = formatted[k];
                }
                for (uint k = i + j; k < uri.length; k++) {
                    tempBytes[k + formatted.length - 4] = uri[k];
                }
                return string(tempBytes);
            }
        }
        return string(uri);
    }

    function formatTokenId (uint tokenId) external view returns (bytes memory) {
        bytes memory buffer = new bytes(64);
        for (uint256 i = 63; i > 0; --i) {
            buffer[i] = _HEX_SYMBOLS[tokenId & 0xf];
            tokenId >>= 4;
        }
        buffer[0] = _HEX_SYMBOLS[tokenId & 0xf];
        return bytes(buffer);
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
