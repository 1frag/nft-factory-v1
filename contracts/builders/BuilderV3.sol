// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {CondensedNFTs} from "../CondensedNFTs.sol";
import {Random} from "../utils/Random.sol";

contract BuilderV3 is Random {
    event Deployed(address addr);

    function createCondensed(
        string calldata name,
        address gmr
    ) external returns (address) {
        bytes32 _salt = rnd();
        address _addr = address(new CondensedNFTs{salt: _salt}(gmr, name));
        emit Deployed(_addr);
        return _addr;
    }
}
