// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract Proxy {
    address public owner;
    address public implementation;

    constructor() {
        owner = msg.sender;
    }

    function setImplementation(address newImplementation) external {
        require(msg.sender == owner, "Must be owner");
        implementation = newImplementation;
    }

    function setOwner(address newOwner) external {
        require(msg.sender == owner, "Must be owner");
        owner = newOwner;
    }

    fallback() external payable {
        address addr = implementation;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), addr, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 {revert(0, returndatasize())}
            default {return (0, returndatasize())}
        }
    }
}
