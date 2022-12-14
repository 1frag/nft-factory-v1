const hre = require("hardhat");

const deployed = {
    GoodMetadataRepository: '0xE621A818728281B3E1794778d06fD9495B7DAC2c',
    BuilderV1: '0xA2b7db50F8a6B2E23eb958c582fBDa12719f6fbd',
    BuilderV2: '0x053B9eC72Fa9b74a827e23A1F5d6D9e23DdaD77e',
    BuilderV3: '0xC9441ac66f20D9531Db922653a1BfEf430b52213',
    ComposableBuilderV1: '0x3384f9dd16a0d6F9043959b1E039257dA69554D6',
    Factory721: null,
    Factory1155: null,
    CondensedNFTs: null,
};

async function ifNotDeployed (alias, callback) {
    if (!deployed[alias]) {
        console.log(`Deploying ${alias}`);
        const contract = await callback();
        deployed[alias] = contract.address;
        console.log(`${alias} deployed to:`, deployed[alias]);
    }
    const factory = await hre.ethers.getContractFactory(alias);
    return factory.attach(deployed[alias]);
}

function deriveAddress (receipt) {
    return receipt.events[0].data.replace('0x000000000000000000000000', '0x');
}

async function main() {
    const verifications = [];

    const gmr = await ifNotDeployed('GoodMetadataRepository', async () => {
        const GoodMetadataRepository = await hre.ethers.getContractFactory('GoodMetadataRepository');
        const gmr = await GoodMetadataRepository.deploy();
        return gmr.deployed();
    });
    verifications.push(`npx hardhat verify --network goerli ${gmr.address}`);

    const factoryBuilder1 = await ifNotDeployed('BuilderV1', async () => {
        const FactoryBuilder1 = await hre.ethers.getContractFactory('BuilderV1');
        const factoryBuilder1 = await FactoryBuilder1.deploy();
        return factoryBuilder1.deployed();
    });
    verifications.push(`npx hardhat verify --network goerli ${factoryBuilder1.address}`);

    const factoryBuilder2 = await ifNotDeployed('BuilderV2', async () => {
        const FactoryBuilder2 = await hre.ethers.getContractFactory('BuilderV2');
        const factoryBuilder2 = await FactoryBuilder2.deploy();
        return factoryBuilder2.deployed();
    });
    verifications.push(`npx hardhat verify --network goerli ${factoryBuilder2.address}`);

    const factoryBuilder3 = await ifNotDeployed('BuilderV3', async () => {
        const FactoryBuilder3 = await hre.ethers.getContractFactory('BuilderV3');
        const factoryBuilder3 = await FactoryBuilder3.deploy();
        return factoryBuilder3.deployed();
    });
    verifications.push(`npx hardhat verify --network goerli ${factoryBuilder3.address}`);

    const builders = [
        factoryBuilder1.address,
        factoryBuilder2.address,
        factoryBuilder3.address,
    ];
    const composableBuilderV1 = await ifNotDeployed('ComposableBuilderV1', async () => {
        const ComposableBuilderV1 = await hre.ethers.getContractFactory('ComposableBuilderV1');
        const composableBuilderV1 = await ComposableBuilderV1.deploy(
            gmr.address, builders,
        );
        return composableBuilderV1.deployed();
    });
    verifications.push(`npx hardhat verify --network goerli ${composableBuilderV1.address} ${gmr.address} ${builders.join(' ')}`);

    console.log('Deploying Factory721');
    const receipt721 = await (await composableBuilderV1.create721('test721')).wait();
    const address721 = deriveAddress(receipt721);
    console.log('Factory721 deployed to:', address721);
    verifications.push(`npx hardhat verify --network goerli ${address721} ${gmr.address} 'test721'`);

    console.log('Deploying Factory1155');
    const receipt1155 = await (await composableBuilderV1.create1155('test1155')).wait();
    const address1155 = deriveAddress(receipt1155);
    console.log('Factory1155 deployed to:', address1155);
    verifications.push(`npx hardhat verify --network goerli ${address1155} ${gmr.address} 'test1155'`);

    console.log('Deploying CondensedNFTs');
    const receiptCondensed = await (await composableBuilderV1.createCondensed('testCondensed')).wait();
    const addressCondensed = deriveAddress(receiptCondensed);
    console.log('CondensedNFTs deployed to:', addressCondensed);
    verifications.push(`npx hardhat verify --network goerli ${addressCondensed} ${gmr.address} 'testCondensed'`);

    console.log(verifications.join('\n'));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
