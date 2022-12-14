// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { Factory721 } from "../Factory721.sol";

contract BuilderV1 {
    event Deployed(address addr);

    function create721 (string calldata name, address gmr) external returns (address) {
        bytes32 _salt = rnd();
        address _addr = address(new Factory721{salt: _salt}(gmr, name));
        emit Deployed(_addr);
        return _addr;
    }

    function rnd () internal view returns (bytes32) {
        return bytes32(keccak256(abi.encodePacked(
            block.number, msg.sender, tx.gasprice
        )));
    }
}
