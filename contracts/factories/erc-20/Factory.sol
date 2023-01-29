// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {CustomERC20} from "./ERC20.sol";
import {Random} from "../../utils/Random.sol";

contract FactoryERC20 is Random {
    event Deployed(address addr);

    function create20(
        string calldata name,
        string calldata symbol
    ) external returns (address) {
        bytes32 _salt = keccak256(abi.encodePacked(rnd(), name));
        address _addr = address(new CustomERC20{salt: _salt}(name, symbol));
        emit Deployed(_addr);
        return _addr;
    }
}
