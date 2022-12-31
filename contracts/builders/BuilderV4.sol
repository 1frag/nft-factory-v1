// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { Factory721 } from "../Factory721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BuilderV4 {
    uint createdContracts;
    event Deployed(address addr);

    function getName (string calldata name, uint i) internal view returns (string memory) {
        return string.concat(name, " ", Strings.toString(i));
    }

    function multiCreate (
        string calldata name,
        uint n, // contacts count
        uint m, // mints count
        address gmr
    ) external {
        for (uint i = 1; i <= n; i++) {
            address _addr = address(
                new Factory721{salt: bytes32(createdContracts)}(
                    gmr,
                    getName(name, i)
                )
            );
            createdContracts++;
            emit Deployed(_addr);
            for (uint j; j < m; j++) {
                Factory721(_addr).mintV3();
            }
        }
    }
}
