const hre = require("hardhat");

async function main() {
    console.log('Deploying GoodMetadataRepository');
    const GoodMetadataRepository = await hre.ethers.getContractFactory('GoodMetadataRepository');
    const goodMetadataRepository = await GoodMetadataRepository.deploy();
    await goodMetadataRepository.deployed();
    console.log('goodMetadataRepository deployed to:', goodMetadataRepository.address);

    console.log('Deploying BuilderV1');
    const FactoryBuilder = await hre.ethers.getContractFactory('BuilderV1');
    const factoryBuilder = await FactoryBuilder.deploy(goodMetadataRepository.address);
    await factoryBuilder.deployed();
    console.log('factoryBuilder deployed to:', factoryBuilder.address);

    console.log('Deploying Factory721');
    const receipt721 = await (await factoryBuilder.create721('test721')).wait();
    console.log('Factory721 deployed to:', receipt721.events[0].args.addr);

    console.log('Deploying Factory1155');
    const receipt1155 = await (await factoryBuilder.create1155('test1155')).wait();
    console.log('Factory1155 deployed to:', receipt1155.events[0].args.addr);

    console.log(`
npx hardhat verify --network goerli ${goodMetadataRepository.address}
npx hardhat verify --network goerli ${factoryBuilder.address} ${goodMetadataRepository.address}
npx hardhat verify --network goerli ${receipt721.events[0].args.addr} ${goodMetadataRepository.address} 'test721'
npx hardhat verify --network goerli ${receipt1155.events[0].args.addr} ${goodMetadataRepository.address} 'test1155'`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
