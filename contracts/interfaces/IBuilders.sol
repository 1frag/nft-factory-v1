// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IBuilders {
    function create721(
        string calldata name,
        address gmr
    ) external returns (address);

    function create1155(
        string calldata name,
        address gmr
    ) external returns (address);

    function createCondensed(
        string calldata name,
        address gmr
    ) external returns (address);
}
