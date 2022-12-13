const hre = require("hardhat");

async function main() {
    const GoodMetadataRepository = await hre.ethers.getContractFactory('GoodMetadataRepository');
    const goodMetadataRepository = await GoodMetadataRepository.deploy();
    await goodMetadataRepository.deployed();

    const FactoryBuilder = await hre.ethers.getContractFactory('BuilderV1');
    const factoryBuilder = await FactoryBuilder.deploy(goodMetadataRepository.address);
    await factoryBuilder.deployed();

    console.log("goodMetadataRepository deployed to:", goodMetadataRepository.address);
    console.log("factoryBuilder deployed to:", factoryBuilder.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
