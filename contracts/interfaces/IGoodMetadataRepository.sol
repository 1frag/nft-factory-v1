// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IGoodMetadataRepository {
    function add(
        address contractAddress,
        uint tokenId,
        bool throwError
    ) external;

    function remove(uint index) external;

    function get() external returns (address, uint);

    function hashState() external view returns (uint);

    function getSpecifyingRnd(
        uint _rndValue
    ) external view returns (address, uint);
}
