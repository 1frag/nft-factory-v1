const { ethers } = require('hardhat');
const { expect } = require('chai');

async function deploy () {
    const Test = await ethers.getContractFactory('TestERC721');
    const test = await Test.deploy();
    await test.deployed();

    const TestGoodMetadataRepository = await ethers.getContractFactory('TestGoodMetadataRepository');
    const testGoodMetadataRepository = await TestGoodMetadataRepository.deploy(test.address, 3);
    await testGoodMetadataRepository.deployed();

    const BuilderV1 = await ethers.getContractFactory('BuilderV1');
    const builderV1 = await BuilderV1.deploy();
    await builderV1.deployed();

    const BuilderV2 = await ethers.getContractFactory('BuilderV2');
    const builderV2 = await BuilderV2.deploy();
    await builderV2.deployed();

    const BuilderV3 = await ethers.getContractFactory('BuilderV3');
    const builderV3 = await BuilderV3.deploy();
    await builderV3.deployed();

    const BuilderV4 = await ethers.getContractFactory('BuilderV4');
    const builderV4 = await BuilderV4.deploy();
    await builderV4.deployed();

    const ComposableBuilderV1 = await ethers.getContractFactory('ComposableBuilderV1');
    const composableBuilderV1 = await ComposableBuilderV1.deploy(
        testGoodMetadataRepository.address,
        [
            builderV1.address,
            builderV2.address,
            builderV3.address,
            builderV4.address,
        ],
    );
    await composableBuilderV1.deployed();

    return [composableBuilderV1, builderV1, builderV2, builderV3, builderV4, testGoodMetadataRepository];
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

    tx = await (await composableBuilderV1.multiCreate('test', 2, 2)).wait();
    expect(tx.events.length).to.be.eq(6);
});
