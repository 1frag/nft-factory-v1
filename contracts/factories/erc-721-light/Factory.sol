// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC721Light} from "./ERC721Light.sol";
import {Random} from "../../utils/Random.sol";

contract FactoryLightERC721 is Random {
    event Deployed(address addr);

    function createLight721(
        string calldata name,
        address gmr
    ) external returns (address) {
        bytes32 _salt = keccak256(abi.encodePacked(rnd(), name));
        address _addr = address(new ERC721Light{salt: _salt}(gmr, name));
        emit Deployed(_addr);
        return _addr;
    }
}
