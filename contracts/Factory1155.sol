// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import { Ownable } from "./external/nibbstack/erc721/src/contracts/ownership/ownable.sol";

import { IGoodMetadataRepository } from "./IGoodMetadataRepository.sol";
import { IFactory } from "./IFactory.sol";
import { BaseFactory } from "./BaseFactory.sol";

contract Factory1155 is ERC1155(""), Ownable, BaseFactory, IFactory {
    uint public lastTokenId;

    IGoodMetadataRepository public gmr;

    mapping(uint256 => string) private idToUri;
    mapping(uint256 => address) private _owner;

    constructor (
        address goodMetadataRepositoryAddress,
        string memory _nftName
    ) {
        nftName = _nftName;
        nftSymbol = "Symbol";
        gmr = IGoodMetadataRepository(goodMetadataRepositoryAddress);
    }

    string internal nftName;
    string internal nftSymbol;

    function renameContract (string calldata name, string calldata symbol) external override {
        nftName = name;
        nftSymbol = symbol;
    }

    function name() external view returns (string memory _name) {
        _name = nftName;
    }

    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        return idToUri[tokenId];
    }

    function _setTokenUri(uint256 _tokenId, string memory _uri) internal {
        idToUri[_tokenId] = _uri;
    }

    function _afterTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {
        _owner[ids[0]] = to;
    }

    function mintV1 (
        address _to,
        string calldata _uri
    ) external {
        lastTokenId += 1;
        super._mint(_to, lastTokenId, 1, "");
        _setTokenUri(lastTokenId, _uri);
    }

    function mintV2 (
        string calldata _uri
    ) external {
        this.mintV1(tx.origin, _uri);
    }

    function mintV3 () external {
        (address contractAddress, uint tokenId) = gmr.get();
        this.mintV1(tx.origin, this.getUriFromAnotherCollection(contractAddress, tokenId));
    }

    function mintV4 (address contractAddress, uint tokenId) external {
        gmr.add(contractAddress, tokenId, false);
        this.mintV1(tx.origin, this.getUriFromAnotherCollection(contractAddress, tokenId));
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
        address owner = _owner[tokenId];
        super._safeTransferFrom(owner, intermediate, tokenId, 1, "");
        super._safeTransferFrom(intermediate, owner, tokenId, 1, "");
    }

    function refreshAll () external {
        for (uint tokenId = 1; tokenId <= lastTokenId; tokenId++) {
            this.refresh(tokenId);
        }
    }

    function rnd () internal view returns (uint) {
        return uint(keccak256(abi.encodePacked(
            block.number, msg.sender, tx.gasprice, lastTokenId
        )));
    }

    function changeMetadata (
        uint256 _tokenId,
        string calldata _uri
    ) external {
        _setTokenUri(_tokenId, _uri);
    }

    function changeMetadataBatch (
        uint256 _left,
        uint256 _right,
        string calldata _uri
    ) external {
        for (uint tokenId = _left; tokenId <= _right; tokenId++) {
            _setTokenUri(tokenId, _uri);
        }
    }

    function transfer (address _to, uint256 _tokenId) external {
        address owner = _owner[_tokenId];
        super._safeTransferFrom(owner, _to, _tokenId, 1, "");
    }
}
