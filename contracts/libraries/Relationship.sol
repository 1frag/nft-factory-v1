// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {NameEncoder} from "@ensdomains/ens-contracts/contracts/utils/NameEncoder.sol";

import {IENS} from "../interfaces/IENS.sol";

library Relationship {
    function resolverAddress() internal view returns (address) {
        IENS ens = IENS(0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e);
        (, bytes32 ifragNameHash) = NameEncoder.dnsEncodeName("ifrag-dev.ru");

        return ens.resolver(ifragNameHash);
    }
}
