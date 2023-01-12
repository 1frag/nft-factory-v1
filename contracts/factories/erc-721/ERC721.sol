// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {NFTokenMetadata} from "../../external/nibbstack/erc721/src/contracts/tokens/nf-token-metadata.sol";
import {ERC721Metadata} from "../../external/nibbstack/erc721/src/contracts/tokens/erc721-metadata.sol";
import {Ownable} from "../../external/nibbstack/erc721/src/contracts/ownership/ownable.sol";

import {IGoodMetadataRepository} from "../../interfaces/IGoodMetadataRepository.sol";
import {IdReplacer} from "../../utils/IdReplacer.sol";

contract CustomERC721 is NFTokenMetadata, Ownable {
    uint internal lastTokenId;

    IGoodMetadataRepository public gmr;

    constructor(address goodMetadataRepositoryAddress, string memory _nftName) {
        nftName = _nftName;
        nftSymbol = "Symbol";
        gmr = IGoodMetadataRepository(goodMetadataRepositoryAddress);
        owner = tx.origin;
    }

    function renameContract(
        string calldata name,
        string calldata symbol
    ) external {
        nftName = name;
        nftSymbol = symbol;
    }

    function mintV1(address _to, string memory _uri) public {
        lastTokenId += 1;
        super._mint(_to, lastTokenId);
        super._setTokenUri(lastTokenId, _uri);
    }

    function mintV2(string calldata _uri) external {
        mintV1(tx.origin, _uri);
    }

    function mintV3() public {
        (address contractAddress, uint tokenId) = gmr.get();
        mintV1(
            tx.origin,
            IdReplacer.getUriFromAnotherCollection(contractAddress, tokenId)
        );
    }

    function mintV4(address contractAddress, uint tokenId) public {
        mintV1(
            tx.origin,
            IdReplacer.getUriFromAnotherCollection(contractAddress, tokenId)
        );
    }

    function mintV5(string calldata tokenName, string calldata image) external {
        string memory _uri = string(
            abi.encodePacked(
                'data:application/json;utf8,{"name": "',
                tokenName,
                '", "image": "',
                image,
                '"}'
            )
        );
        mintV1(tx.origin, _uri);
    }

    function mintV6(
        address contractAddress,
        uint fromTokenId,
        uint toTokenId
    ) external {
        for (uint tokenId = fromTokenId; tokenId <= toTokenId; tokenId++) {
            mintV4(contractAddress, tokenId);
        }
    }

    function mintV7(uint n) external {
        for (uint i; i < n; i++) {
            mintV3();
        }
    }

    function refresh(uint tokenId) public {
        address intermediate = address(uint160(rnd()));
        address owner = idToOwner[tokenId];
        super._transfer(intermediate, tokenId);
        super._transfer(owner, tokenId);
    }

    function refreshAll() external {
        for (uint tokenId = 1; tokenId <= lastTokenId; tokenId++) {
            refresh(tokenId);
        }
    }

    function rnd() internal view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.number, lastTokenId)));
    }

    function changeMetadata(uint256 _tokenId, string calldata _uri) external {
        super._setTokenUri(_tokenId, _uri);
    }

    function changeMetadataBatch(
        uint256 _left,
        uint256 _right,
        string calldata _uri
    ) external {
        for (uint tokenId = _left; tokenId <= _right; tokenId++) {
            super._setTokenUri(tokenId, _uri);
        }
    }

    function transfer(address _to, uint256 _tokenId) external {
        super._transfer(_to, _tokenId);
    }
}
