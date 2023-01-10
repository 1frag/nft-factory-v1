// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "../../external/nibbstack/erc721/src/contracts/ownership/ownable.sol";

import {IGoodMetadataRepository} from "../../interfaces/IGoodMetadataRepository.sol";
import {IdReplacer} from "../../utils/IdReplacer.sol";

contract CustomERC1155 is ERC1155(""), Ownable {
    constructor(address goodMetadataRepositoryAddress, string memory _name) {
        name = _name;
        symbol = "Symbol";
        gmr = IGoodMetadataRepository(goodMetadataRepositoryAddress);
        owner = tx.origin;
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

    // metadata
    mapping(uint256 => string) private idToUri;

    function uri(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        return idToUri[tokenId];
    }

    function _setTokenUri(uint256 _tokenId, string memory _uri) internal {
        idToUri[_tokenId] = _uri;
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

    // marketplace
    uint public lastTokenId;

    IGoodMetadataRepository public gmr;

    mapping(uint256 => address) private _owner;

    function _afterTokenTransfer(
        address, // operator
        address, // from
        address to,
        uint256[] memory ids,
        uint256[] memory, // amounts
        bytes memory // data
    ) internal override {
        _owner[ids[0]] = to;
    }

    function mintV1(address _to, string memory _uri) public {
        lastTokenId += 1;
        super._mint(_to, lastTokenId, 1, "");
        _setTokenUri(lastTokenId, _uri);
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
        gmr.add(contractAddress, tokenId, false);
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
        address owner = _owner[tokenId];
        super._safeTransferFrom(owner, intermediate, tokenId, 1, "");
        super._safeTransferFrom(intermediate, owner, tokenId, 1, "");
    }

    function refreshAll() external {
        for (uint tokenId = 1; tokenId <= lastTokenId; tokenId++) {
            refresh(tokenId);
        }
    }

    function rnd() internal view returns (uint) {
        return
            uint(
                keccak256(
                    abi.encodePacked(
                        block.number,
                        msg.sender,
                        tx.gasprice,
                        lastTokenId
                    )
                )
            );
    }

    function transfer(address _to, uint256 _tokenId) external {
        address owner = _owner[_tokenId];
        super._safeTransferFrom(owner, _to, _tokenId, 1, "");
    }
}
