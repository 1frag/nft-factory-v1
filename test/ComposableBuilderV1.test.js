const { ethers } = require('hardhat');
const { expect } = require('chai');

async function deploy () {
    const Test = await ethers.getContractFactory('TestERC721');
    const test = await Test.deploy();
    await test.deployed();

    const TestGoodMetadataRepository = await ethers.getContractFactory('TestGoodMetadataRepository');
    const testGoodMetadataRepository = await TestGoodMetadataRepository.deploy(test.address, 3);
    await testGoodMetadataRepository.deployed();

    const FactoryERC721 = await ethers.getContractFactory('FactoryERC721');
    const factoryERC721 = await FactoryERC721.deploy();
    await factoryERC721.deployed();

    const FactoryERC1155 = await ethers.getContractFactory('FactoryERC1155');
    const factoryERC1155 = await FactoryERC1155.deploy();
    await factoryERC1155.deployed();

    const FactoryCondensed = await ethers.getContractFactory('FactoryCondensed');
    const factoryCondensed = await FactoryCondensed.deploy();
    await factoryCondensed.deployed();

    const Facade = await ethers.getContractFactory('Facade');
    const facade = await Facade.deploy(
        testGoodMetadataRepository.address,
        [
            factoryERC721.address,
            factoryERC1155.address,
            factoryCondensed.address,
        ],
    );
    await facade.deployed();

    return [facade, factoryERC721, factoryERC1155, factoryCondensed, testGoodMetadataRepository];
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
    const FactoryERC721 = await ethers.getContractFactory('FactoryERC721');
    const ERC721 = await ethers.getContractFactory('CustomERC721');

    const [facade] = await deploy();
    const tx = await facade.multiCreate('test', 2, 4);
    const receipt = await tx.wait();
    expect(receipt.events.length).to.be.eq(10);

    let log;

    log = FactoryERC721.interface.parseLog(receipt.events[0]);
    expect(log.name).to.be.eq('Deployed');

    const first = log.args.addr;
    const firstFactory = ERC721.attach(first);
    expect(await firstFactory.name()).to.be.eq('test 1');

    for (let i = 1; i < 5; i++) {
        expect(receipt.events[i].address).to.be.eq(first);
        log = ERC721.interface.parseLog(receipt.events[i]);
        expect(log.args._from).to.be.eq(ethers.constants.AddressZero);
        expect(log.args._to).to.be.eq(tx.from);
    }

    log = FactoryERC721.interface.parseLog(receipt.events[5]);
    expect(log.name).to.be.eq('Deployed');

    const second = log.args.addr;
    const secondFactory = ERC721.attach(second);
    expect(await secondFactory.name()).to.be.eq('test 2');
    for (let i = 6; i < 10; i++) {
        expect(receipt.events[i].address).to.be.eq(second);
        log = ERC721.interface.parseLog(receipt.events[i]);
        expect(log.args._from).to.be.eq(ethers.constants.AddressZero);
        expect(log.args._to).to.be.eq(tx.from);
    }
});
