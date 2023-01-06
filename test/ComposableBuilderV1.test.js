const { ethers } = require('hardhat');
const { expect } = require('chai');

async function deploy () {
    const Test = await ethers.getContractFactory('TestERC721');
    const test = await Test.deploy();
    await test.deployed();

    const TestGoodMetadataRepository = await ethers.getContractFactory('TestGoodMetadataRepository');
    const testGoodMetadataRepository = await TestGoodMetadataRepository.deploy(test.address, 3);
    await testGoodMetadataRepository.deployed();

    const BuilderERC721 = await ethers.getContractFactory('BuilderERC721');
    const builderERC721 = await BuilderERC721.deploy();
    await builderERC721.deployed();

    const BuilderERC1155 = await ethers.getContractFactory('BuilderERC1155');
    const builderERC1155 = await BuilderERC1155.deploy();
    await builderERC1155.deployed();

    const BuilderCondensed = await ethers.getContractFactory('BuilderCondensed');
    const builderCondensed = await BuilderCondensed.deploy();
    await builderCondensed.deployed();

    const Facade = await ethers.getContractFactory('Facade');
    const facade = await Facade.deploy(
        testGoodMetadataRepository.address,
        [
            builderERC721.address,
            builderERC1155.address,
            builderCondensed.address,
        ],
    );
    await facade.deployed();

    return [facade, BuilderERC721, builderERC1155, builderCondensed, testGoodMetadataRepository];
}

it('create*', async function () {
    const [facade] = await deploy();
    let tx;

    tx = await (await facade.create721('test1')).wait();
    expect(tx.events.length).to.be.eq(1);

    tx = await (await facade.create1155('test2')).wait();
    expect(tx.events.length).to.be.eq(1);

    tx = await (await facade.createCondensed('test3')).wait();
    expect(tx.events.length).to.be.eq(1);
});

it('Facade.multiCreate', async () => {
    const BuilderERC721 = await ethers.getContractFactory('BuilderERC721');
    const Factory721 = await ethers.getContractFactory('Factory721');

    const [facade] = await deploy();
    const tx = await facade.multiCreate('test', 2, 4);
    const receipt = await tx.wait();
    expect(receipt.events.length).to.be.eq(10);

    let log;

    log = BuilderERC721.interface.parseLog(receipt.events[0]);
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

    log = BuilderERC721.interface.parseLog(receipt.events[5]);
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
