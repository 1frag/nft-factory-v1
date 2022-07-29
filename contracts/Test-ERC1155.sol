// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract TestERC1155 is ERC1155 {
    constructor () ERC1155("<some-data>") {
        _mint(msg.sender, 5, 10**18, "");
    }
}
