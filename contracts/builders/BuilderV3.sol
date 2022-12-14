// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { CondensedNFTs } from "../CondensedNFTs.sol";

contract BuilderV3 {
    event Deployed(address addr);

    function createCondensed (string calldata name, address gmr) external returns (address) {
        bytes32 _salt = rnd();
        address _addr = address(new CondensedNFTs{salt: _salt}(gmr, name));
        emit Deployed(_addr);
        return _addr;
    }

    function rnd () internal view returns (bytes32) {
        return bytes32(keccak256(abi.encodePacked(
            block.number, msg.sender, tx.gasprice
        )));
    }
}
