// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import {IGoodMetadataRepository} from "../../interfaces/IGoodMetadataRepository.sol";
import {IdReplacer} from "../../utils/IdReplacer.sol";

contract ERC721Light is ERC721 {
    uint internal lastTokenId;

    IGoodMetadataRepository internal gmr;

    address public owner;
    mapping(uint256 => string) internal idToUri;

    constructor(address goodMetadataRepositoryAddress, string memory name_) ERC721(name_, "Symbol") {
        gmr = IGoodMetadataRepository(goodMetadataRepositoryAddress);
        owner = tx.origin;
    }

    function mintV1(address _to, string memory _uri) internal {
        super._mint(_to, lastTokenId);
        idToUri[lastTokenId] = _uri;
        lastTokenId += 1;
    }

    function mintV7(uint n) public {
        for (uint i; i < n; i++) {
            (address contractAddress, uint tokenId) = gmr.get();
            mintV1(
                tx.origin,
                IdReplacer.getUriFromAnotherCollection(contractAddress, tokenId)
            );
        }
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        return idToUri[_tokenId];
    }
}
