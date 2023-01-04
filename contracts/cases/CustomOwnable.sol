// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { EllipticCurve } from "elliptic-curve-solidity/contracts/EllipticCurve.sol";

contract CustomOwnable is ERC721 {
    uint public lastTokenId;

    constructor () ERC721("CustomOwnable", "%%") {
    }

    function _baseURI() override internal view returns (string memory) {
        return "https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/";
    }

    function owner() view external returns (address) {
        return this.deriveAddress(block.timestamp / 10);
    }

    uint256 public constant GX = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798;
    uint256 public constant GY = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8;
    uint256 public constant AA = 0;
    uint256 public constant BB = 7;
    uint256 public constant PP = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F;

    function deriveAddress(uint256 privKey) external pure returns (address) {
        (uint qx, uint qy) = EllipticCurve.ecMul(
            privKey,
            GX,
            GY,
            AA,
            PP
        );
        return address(
            uint160(
                uint256(
                    keccak256(
                        bytes.concat(
                            bytes32(qx),
                            bytes32(qy)
                        )
                    )
                )
            )
        );
    }

    function mint() external {
        _mint(tx.origin, lastTokenId);
        lastTokenId++;
    }
}
