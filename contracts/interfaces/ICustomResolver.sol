// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ICustomResolver {
    function setInterfaceImplementer(bytes4 interfaceID, address addr) external;

    function interfaceImplementer(
        bytes4 interfaceID
    ) external view returns (address);
}
