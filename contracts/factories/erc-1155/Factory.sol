// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {CustomERC1155} from "./ERC1155.sol";
import {Random} from "../../utils/Random.sol";

contract FactoryERC1155 is Random {
    event Deployed(address addr);

    function create1155(
        string calldata name,
        address gmr
    ) external returns (address) {
        bytes32 _salt = rnd();
        address _addr = address(new CustomERC1155{salt: _salt}(gmr, name));
        emit Deployed(_addr);
        return _addr;
    }
}
