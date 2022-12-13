const hre = require("hardhat");

async function main () {
    const GoodMetadataRepository = await hre.ethers.getContractFactory('GoodMetadataRepository');
    const goodMetadataRepository = await GoodMetadataRepository.deploy();
    await goodMetadataRepository.deployed();

    // goerli: 0xF9F3e075b74A3678ad4555828072171E107B65Bc
    console.log('Deployed to:', goodMetadataRepository.address);
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
