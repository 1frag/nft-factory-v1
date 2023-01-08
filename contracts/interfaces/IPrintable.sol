// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IPrintable {
    function isPrintable(uint c) external view returns (bool);

    function getIthPrintable(uint c) external view returns (uint);
}
