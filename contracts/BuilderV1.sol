// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { Factory721 } from "./Factory721.sol";
import { Factory1155 } from "./Factory1155.sol";

contract BuilderV1 {
    address public gmr;

    event Deployed(address addr);

    constructor (address _gmr) {
        gmr = _gmr;
    }

    function create721 (string calldata name) external returns (address) {
        bytes32 _salt = rnd();
        address _addr = address(new Factory721{salt: _salt}(gmr, name));
        emit Deployed(_addr);
        return _addr;
    }

    function create1155 (string calldata name) external returns (address) {
        bytes32 _salt = rnd();
        address _addr = address(new Factory1155{salt: _salt}(gmr, name));
        emit Deployed(_addr);
        return _addr;
    }

    function rnd () internal view returns (bytes32) {
        return bytes32(keccak256(abi.encodePacked(
            block.number, msg.sender, tx.gasprice
        )));
    }

    function _setGMR (address _gmr) external {
        gmr = _gmr;
    }
}
