// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Random} from "../utils/Random.sol";

contract TestRandom is Random {
    function randomUint() external view returns (bytes32) {
        return rnd();
    }

    function randomSymbol() external view returns (string memory) {
        return symbol();
    }
}
