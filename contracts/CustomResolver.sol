// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ICustomResolver} from "./interfaces/ICustomResolver.sol";
import {Relationship} from "./libraries/Relationship.sol";

contract CustomResolver is ICustomResolver {
    mapping(bytes4 => address) internal _interfaceImplementer;
    address public owner;

    string public constant NOT_CURRENT_OWNER = "018001";

    constructor() {
        owner = tx.origin;
        _interfaceImplementer[type(ICustomResolver).interfaceId] = address(
            this
        );
    }

    function setInterfaceImplementer(
        bytes4 interfaceID,
        address addr
    ) external {
        require(msg.sender == owner || tx.origin == owner, NOT_CURRENT_OWNER);
        _interfaceImplementer[interfaceID] = addr;
    }

    function interfaceImplementer(
        bytes4 interfaceID
    ) external view returns (address) {
        return _interfaceImplementer[interfaceID];
    }

    function resolverAddress() external view returns (address) {
        return Relationship.resolverAddress();
    }
}
