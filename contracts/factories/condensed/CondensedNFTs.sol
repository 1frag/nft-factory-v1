// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "../../external/nibbstack/erc721/src/contracts/ownership/ownable.sol";

import {IGoodMetadataRepository} from "../../interfaces/IGoodMetadataRepository.sol";
import {IdReplacer} from "../../utils/IdReplacer.sol";

contract CondensedNFTs is ERC1155(""), Ownable, IdReplacer {
    uint public lastTokenId;

    IGoodMetadataRepository public gmr;

    constructor(address goodMetadataRepositoryAddress, string memory _name) {
        name = _name;
        symbol = "Symbol";
        gmr = IGoodMetadataRepository(goodMetadataRepositoryAddress);
        owner = tx.origin;
    }

    // metadata
    mapping(uint256 => string) private idToUri;

    function uri(uint256 tokenId) public view override returns (string memory) {
        return idToUri[tokenId];
    }

    function changeMetadata(uint256 _tokenId, string calldata _uri) external {
        _setTokenUri(_tokenId, _uri);
    }

    function changeMetadataBatch(
        uint256 _left,
        uint256 _right,
        string calldata _uri
    ) external {
        for (uint tokenId = _left; tokenId <= _right; tokenId++) {
            _setTokenUri(tokenId, _uri);
        }
    }

    function _setTokenUri(uint256 _tokenId, string memory _uri) internal {
        idToUri[_tokenId] = _uri;
    }

    // named
    string public name;
    string public symbol;

    function renameContract(
        string calldata _name,
        string calldata _symbol
    ) external {
        name = _name;
        symbol = _symbol;
    }

    // marketplace
    function mintV1(uint amount) external {
        lastTokenId += 1;
        super._mint(tx.origin, lastTokenId, amount, "");

        (address contractAddress, uint tokenId) = gmr.get();
        string memory _uri = this.getUriFromAnotherCollection(
            contractAddress,
            tokenId
        );
        _setTokenUri(lastTokenId, _uri);
    }

    function mintV2(uint id, uint amount) external {
        super._mint(tx.origin, id, amount, "");

        (address contractAddress, uint tokenId) = gmr.get();
        string memory _uri = this.getUriFromAnotherCollection(
            contractAddress,
            tokenId
        );
        _setTokenUri(id, _uri);
    }

    function mintBatchV1(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external {
        super._mintBatch(to, ids, amounts, data);

        for (uint id; id < ids.length; id++) {
            (address contractAddress, uint tokenId) = gmr.get();
            string memory _uri = this.getUriFromAnotherCollection(
                contractAddress,
                tokenId
            );
            _setTokenUri(id, _uri);
        }
    }

    function burnV1(uint amount, uint id) external {
        super._burn(tx.origin, id, amount);
    }

    function burnBatchV1(
        address from,
        uint256[] memory ids,
        uint256[] memory amounts
    ) external {
        super._burnBatch(from, ids, amounts);
    }
}
