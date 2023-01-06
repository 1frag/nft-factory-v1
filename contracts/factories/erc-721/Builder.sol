// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Factory721} from "./Factory721.sol";
import {Random} from "../../utils/Random.sol";

contract BuilderERC721 is Random {
    event Deployed(address addr);

    function create721(
        string calldata name,
        address gmr
    ) external returns (address) {
        bytes32 _salt = keccak256(abi.encodePacked(rnd(), name));
        address _addr = address(new Factory721{salt: _salt}(gmr, name));
        emit Deployed(_addr);
        return _addr;
    }
}
