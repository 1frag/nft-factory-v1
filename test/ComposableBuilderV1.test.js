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

    const ComposableBuilderV1 = await ethers.getContractFactory('ComposableBuilderV1');
    const composableBuilderV1 = await ComposableBuilderV1.deploy(
        testGoodMetadataRepository.address,
        [
            builderV1.address,
            builderV2.address,
            builderV3.address,
        ],
    );
    await composableBuilderV1.deployed();

    return [composableBuilderV1, builderV1, builderV2, builderV3, testGoodMetadataRepository];
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

it('ComposableBuilderV1.multiCreate', async () => {
    const BuilderV1 = await ethers.getContractFactory('BuilderV1');
    const Factory721 = await ethers.getContractFactory('Factory721');

    const [composableBuilder] = await deploy();
    const tx = await composableBuilder.multiCreate('test', 2, 4);
    const receipt = await tx.wait();
    expect(receipt.events.length).to.be.eq(10);

    let log;

    log = BuilderV1.interface.parseLog(receipt.events[0]);
    expect(log.name).to.be.eq('Deployed');

    const first = log.args.addr;
    const firstFactory = Factory721.attach(first);
    expect(await firstFactory.name()).to.be.eq('test 1');

    for (let i = 1; i < 5; i++) {
        expect(receipt.events[i].address).to.be.eq(first);
        log = Factory721.interface.parseLog(receipt.events[i]);
        expect(log.args._from).to.be.eq(ethers.constants.AddressZero);
        expect(log.args._to).to.be.eq(tx.from);
    }

    log = BuilderV1.interface.parseLog(receipt.events[5]);
    expect(log.name).to.be.eq('Deployed');

    const second = log.args.addr;
    const secondFactory = Factory721.attach(second);
    expect(await secondFactory.name()).to.be.eq('test 2');
    for (let i = 6; i < 10; i++) {
        expect(receipt.events[i].address).to.be.eq(second);
        log = Factory721.interface.parseLog(receipt.events[i]);
        expect(log.args._from).to.be.eq(ethers.constants.AddressZero);
        expect(log.args._to).to.be.eq(tx.from);
    }
});
