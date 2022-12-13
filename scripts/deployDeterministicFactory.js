const hre = require("hardhat");

async function main () {
    const Factory = await hre.ethers.getContractFactory('DeterministicDeployFactory');
    const factory = await Factory.deploy();
    await factory.deployed();

    // goerli: 0x89b7d7Aa1D841b17Aab934CAd5F445bd0b678a70
    // goerli: 0x446F3FD7A1084f67Cd8fC08E1c9f90Ac0cBC2db0
    // goerli: 0x90F5F3e6e609cA29ba150A5c1a35F3D4357D0a04
    // goerli: 0x59C2545AeC908fec3488F34F6EE485bD3bB743F1
    console.log('Deployed to:', factory.address);
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
