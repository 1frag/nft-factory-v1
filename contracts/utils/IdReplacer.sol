// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC721Metadata} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import {IERC1155MetadataURI} from "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";

contract IdReplacer {
    bytes16 private constant _HEX_SYMBOLS = "0123456789abcdef";

    bytes4 private constant SEARCH = "{id}";
    uint private constant SEARCH_LENGTH = 4;

    function getUriFromAnotherCollection(
        address contractAddress,
        uint tokenId
    ) internal view returns (string memory) {
        try IERC721Metadata(contractAddress).tokenURI(tokenId) returns (
            string memory result
        ) {
            return result;
        } catch {
            string memory result = IERC1155MetadataURI(contractAddress).uri(
                tokenId
            );
            return this.replaceIdInString(result, tokenId);
        }
    }

    function replaceIdInString(
        string memory _uri,
        uint tokenId
    ) external pure returns (string memory) {
        bytes memory uri = bytes(_uri);
        for (uint i; i <= uri.length - SEARCH_LENGTH; i++) {
            uint j;
            for (; j < SEARCH_LENGTH && uri[i + j] == SEARCH[j]; j++) {}
            if (j == SEARCH_LENGTH) {
                bytes memory formatted = formatTokenId(tokenId);
                bytes memory tempBytes = new bytes(
                    uri.length - 4 + formatted.length
                );
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

    function formatTokenId(uint tokenId) internal pure returns (bytes memory) {
        bytes memory buffer = new bytes(64);
        for (uint256 i = 63; i > 0; --i) {
            buffer[i] = _HEX_SYMBOLS[tokenId & 0xf];
            tokenId >>= 4;
        }
        buffer[0] = _HEX_SYMBOLS[tokenId & 0xf];
        return bytes(buffer);
    }
}
