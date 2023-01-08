const { ethers } = require('hardhat');

module.exports.getInterfaceID = async function (contractName) {
    const {interface: contractInterface} = await ethers.getContractAt(
        contractName,
        ethers.constants.AddressZero
    );

    return Object
        .keys(contractInterface.functions)
        .reduce((interfaceID, fn) => {
            return interfaceID.xor(contractInterface.getSighash(fn))
        }, ethers.constants.Zero)
        .toHexString();
}
