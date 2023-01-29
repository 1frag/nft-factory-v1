// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import {IBuilders} from "./interfaces/IBuilders.sol";
import {IEasyMint} from "./interfaces/IEasyMint.sol";

contract Facade {
    address public gmr;
    address[] public builders;

    constructor(address _gmr, address[] memory _builders) {
        gmr = _gmr;
        require(_builders.length == 5);
        builders = _builders;
    }

    function create721(string calldata name) external returns (address) {
        return IBuilders(builders[0]).create721(name, gmr);
    }

    function create1155(string calldata name) external returns (address) {
        return IBuilders(builders[1]).create1155(name, gmr);
    }

    function createCondensed(string calldata name) external returns (address) {
        return IBuilders(builders[2]).createCondensed(name, gmr);
    }

    function create20(
        string calldata name,
        string calldata symbol
    ) external returns (address) {
        return IBuilders(builders[4]).create20(name, symbol);
    }

    function getName(
        string calldata name,
        uint i
    ) internal pure returns (string memory) {
        return string.concat(name, Strings.toString(i));
    }

    function multiCreate(
        string calldata name,
        uint n, // contacts count
        uint m // mints count
    ) external {
        IBuilders builder = IBuilders(builders[0]);
        for (uint i = 1; i <= n; i++) {
            address _addr = builder.create721(getName(name, i), gmr);
            IEasyMint(_addr).mintV7(m);
        }
    }

    function lightMultiCreate(
        string calldata name,
        uint n, // contacts count
        uint m // mints count
    ) external {
        IBuilders builder = IBuilders(builders[3]);
        for (uint i = 1; i <= n; i++) {
            address _addr = builder.createLight721(getName(name, i), gmr);
            IEasyMint(_addr).mintV7(m);
        }
    }

    function _setGMR(address _gmr) external {
        gmr = _gmr;
    }

    function _setBuilder(uint i, address builder) external {
        builders[i] = builder;
    }
}
