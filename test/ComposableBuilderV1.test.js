const { ethers } = require('hardhat');
const { expect } = require('chai');

async function deploy () {
    const GoodMetadataRepository = await ethers.getContractFactory('GoodMetadataRepository');
    const goodMetadataRepository = await GoodMetadataRepository.deploy();
    await goodMetadataRepository.deployed();

    const BuilderV1 = await ethers.getContractFactory('BuilderV1');
    const builderV1 = await BuilderV1.deploy();
    await builderV1.deployed();

    const BuilderV2 = await ethers.getContractFactory('BuilderV2');
    const builderV2 = await BuilderV2.deploy();
    await builderV2.deployed();

    const BuilderV3 = await ethers.getContractFactory('BuilderV3');
    const builderV3 = await BuilderV3.deploy();
    await builderV3.deployed();

    const ComposableBuilderV1 = await ethers.getContractFactory('ComposableBuilderV1');
    const composableBuilderV1 = await ComposableBuilderV1.deploy(
        goodMetadataRepository.address,
        [
            builderV1.address,
            builderV2.address,
            builderV3.address,
        ],
    );
    await composableBuilderV1.deployed();

    return [composableBuilderV1, builderV1, builderV2, builderV3, goodMetadataRepository];
}

it('create*', async function () {
    const [composableBuilderV1] = await deploy();
    let tx;

    tx = await (await composableBuilderV1.create721('test1')).wait();
    expect(tx.events.length).to.be.eq(1);

    tx = await (await composableBuilderV1.create1155('test2')).wait();
    expect(tx.events.length).to.be.eq(1);

    tx = await (await composableBuilderV1.createCondensed('test3')).wait();
    expect(tx.events.length).to.be.eq(1);
});
