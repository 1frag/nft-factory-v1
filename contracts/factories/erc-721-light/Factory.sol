// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Random} from "../../utils/Random.sol";

contract FactoryLightERC721 is Random {
    event Deployed(address addr);

    bytes _creationCode;

    function setCreationCode(bytes memory creationCode_) external {
        _creationCode = creationCode_;
    }

    function getBytecode(
        string calldata name,
        address gmr
    ) internal view returns (bytes memory) {
        return abi.encodePacked(_creationCode, abi.encode(gmr), abi.encode(name));
    }

    function createLight721(
        string calldata name,
        address gmr
    ) external returns (address) {
        bytes32 _salt = keccak256(abi.encodePacked(rnd(), name));

        address _addr = deploy(getBytecode(name, gmr), uint(_salt));
        emit Deployed(_addr);
        return _addr;
    }

    function deploy(bytes memory bytecode, uint _salt) internal returns (address) {
        address addr;

        assembly {
            addr := create2(
                callvalue(),
                add(bytecode, 0x20),
                mload(bytecode),
                _salt
            )

            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }
        return addr;
    }
}
