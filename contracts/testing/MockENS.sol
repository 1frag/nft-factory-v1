// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IENS} from "../interfaces/IENS.sol";

contract MockENS is IENS {
    mapping(bytes32 => address) _resolver;

    function setResolver(bytes32 node, address addr) external {
        _resolver[node] = addr;
    }

    function resolver(bytes32 node) external view returns (address) {
        return _resolver[node];
    }
}
