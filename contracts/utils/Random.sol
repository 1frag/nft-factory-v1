// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Random {
    // using contract saves 0.022 KiB in contract size
    function rnd() internal view returns (bytes32) {
        return
            keccak256(abi.encodePacked(msg.sender, block.number, tx.gasprice));
    }
}
