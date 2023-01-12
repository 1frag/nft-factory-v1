// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {IdReplacer} from "../utils/IdReplacer.sol";

contract TestIdReplacer {
    function replaceIdInString(
        string memory _uri,
        uint tokenId
    ) external pure returns (string memory) {
        return IdReplacer.replaceIdInString(_uri, tokenId);
    }
}
