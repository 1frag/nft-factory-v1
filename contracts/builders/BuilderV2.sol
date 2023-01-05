// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Factory1155} from "../Factory1155.sol";

contract BuilderV2 {
    event Deployed(address addr);

    function create1155(
        string calldata name,
        address gmr
    ) external returns (address) {
        bytes32 _salt = rnd();
        address _addr = address(new Factory1155{salt: _salt}(gmr, name));
        emit Deployed(_addr);
        return _addr;
    }

    function rnd() internal view returns (bytes32) {
        return
            bytes32(
                keccak256(
                    abi.encodePacked(block.number, msg.sender, tx.gasprice)
                )
            );
    }
}
