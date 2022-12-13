// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "./external/nibbstack/erc721/src/contracts/tokens/nf-token-metadata.sol";
import "./external/nibbstack/erc721/src/contracts/tokens/erc721-metadata.sol";
import "./external/nibbstack/erc721/src/contracts/ownership/ownable.sol";

import { IGoodMetadataRepository } from "./IGoodMetadataRepository.sol";

contract BaseFactory {
    // Utils
    bytes16 private constant _HEX_SYMBOLS = "0123456789abcdef";

    bytes4 private constant SEARCH = "{id}";
    uint private constant SEARCH_LENGTH = 4;

    function getUriFromAnotherCollection (
        address contractAddress,
        uint tokenId
    ) external returns (string memory) {
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
}
