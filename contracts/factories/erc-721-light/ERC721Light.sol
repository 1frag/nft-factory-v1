// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import {IGoodMetadataRepository} from "../../interfaces/IGoodMetadataRepository.sol";
import {IdReplacer} from "../../utils/IdReplacer.sol";

contract ERC721Light is ERC721 {
    uint internal lastTokenId;

    IGoodMetadataRepository internal gmr;
    string private _name;

    constructor(
        address goodMetadataRepositoryAddress,
        string memory name_
    ) ERC721("", "") {
        gmr = IGoodMetadataRepository(goodMetadataRepositoryAddress);
        _name = name_;
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public pure override returns (string memory) {
        return "Symbol";
    }

    function mintV7(uint n) public {
        for (uint i; i < n; ) {
            super._mint(tx.origin, lastTokenId);
            unchecked {
                lastTokenId += 1;
                i++;
            }
        }
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        (address contractAddress, uint tokenId) = gmr.getSpecifyingRnd(
            uint(keccak256(abi.encodePacked(address(this), _tokenId)))
        );
        return IdReplacer.getUriFromAnotherCollection(contractAddress, tokenId);
    }
}
