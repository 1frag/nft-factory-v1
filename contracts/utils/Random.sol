// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {UTF8Encoder} from "./UTF8Encoder.sol";

import {ICustomResolver} from "../interfaces/ICustomResolver.sol";
import {Relationship} from "../libraries/Relationship.sol";
import {IPrintable} from "../interfaces/IPrintable.sol";

// using contract saves 0.022 KiB in contract size
contract Random {
    using UTF8Encoder for uint32;

    function rnd() internal view returns (bytes32) {
        return
            keccak256(abi.encodePacked(msg.sender, block.number, tx.gasprice));
    }

    function symbol() internal view returns (string memory) {
        ICustomResolver resolver = ICustomResolver(
            Relationship.resolverAddress()
        );
        IPrintable printable = IPrintable(
            resolver.interfaceImplementer(type(IPrintable).interfaceId)
        );
        uint r = uint256(rnd());
        uint32 c = uint32(printable.getIthPrintable(r));
        return c.UTF8Encode();
    }
}
