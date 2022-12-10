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
        0x532f7B0b043eFf8F3146D450e28AB00147739dAF,
        0x5280DA1F82649Af74Fe2D9A3d73Fe22F8b0F304B,
        0x2bE3Dc344Aa94B11727447CE0b945bc6B701621a,
        0x075dd2477Fd8C66425868970Fe13C9ddAD466A86,
        0xE3f29a15Bb6336eDCD11E3B49D130a0962cF3E65,
        0x06E92A892B7d0673CCFA8ec35e0d2668eC37a503,
        0x7f8Ea903BfEb14087f1d016A09e77840d70e879D,
        0x5257295Cd7D5ac8c5c761282DDAa04087D491c05,
        0x7f8Ea903BfEb14087f1d016A09e77840d70e879D
    ];
    uint[] public tokenIds = [0, 1, 151, 5, 0, 58, 23, 23022200000020200, 24];

    constructor () {
        nftName = "Factory #6 (2022-11-29)";
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
        this.mintV1(tx.origin, _uri);
    }

    function mintV3 () external {
        uint rndValue = rnd() % contractAddresses.length;
        address contractAddress = contractAddresses[rndValue];
        uint tokenId = tokenIds[rndValue];
        this.mintV1(tx.origin, getUriFromAnotherCollection(contractAddress, tokenId));
    }

    function mintV4 (address contractAddress, uint tokenId) external {
        contractAddresses.push(contractAddress);
        tokenIds.push(tokenId);
        this.mintV1(tx.origin, getUriFromAnotherCollection(contractAddress, tokenId));
    }

    function mintV5 (string calldata name, string calldata image) external {
        string memory _uri = string(
            abi.encodePacked(
                'data:application/json;utf8,{"name": "',
                name,
                '", "image": "',
                image,
                '"}'
            )
        );
        this.mintV1(tx.origin, _uri);
    }

    function mintV6 (
        address contractAddress,
        uint fromTokenId,
        uint toTokenId
    ) external {
        for (uint tokenId = fromTokenId; tokenId <= toTokenId; tokenId++) {
            this.mintV4(contractAddress, tokenId);
        }
    }

    function mintV7 (uint n) external {
        for (uint i; i < n; i++) {
            this.mintV3();
        }
    }

    function refresh (uint tokenId) external {
        address intermediate = address(uint160(rnd()));
        address owner = idToOwner[tokenId];
        super._transfer(intermediate, tokenId);
        super._transfer(owner, tokenId);
    }

    function refreshAll () external {
        for (uint tokenId = 1; tokenId <= lastTokenId; tokenId++) {
            this.refresh(tokenId);
        }
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
            block.number, msg.sender, tx.gasprice, lastTokenId
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
