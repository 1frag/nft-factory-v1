// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {BuilderProxy} from "./BuilderProxy.sol";

contract DeterministicDeployFactory {
    function deploy(bytes32 _salt) external returns (address) {
        return address(new BuilderProxy{salt: _salt}());
    }
}
