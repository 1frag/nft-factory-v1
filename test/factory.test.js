const { ethers } = require('hardhat');
const { expect } = require('chai');

it('Test adding metadata clone', async function () {
    const Factory = await ethers.getContractFactory('Factory');
    const factory = await Factory.deploy();
    await factory.deployed();

    const state = await factory.hashState();
    await (await factory.addMetadataClone('0x61e2d70388b191d807918de5c2bea9af09c64753', '5')).wait();

    expect(state.eq(await factory.hashState())).not.to.be.ok;
});

['TestERC721', 'TestERC1155'].forEach(testName => it(`Test mint v4 ${testName}`, async function () {
    const Test = await ethers.getContractFactory(testName);
    const test = await Test.deploy();
    await test.deployed();

    const Factory = await ethers.getContractFactory('Factory');
    const factory = await Factory.deploy();
    await factory.deployed();

    const tx = await (await factory.mintV4(test.address, '5')).wait();
    expect(tx.events.length).to.be.eq(1);
    expect(tx.events[0].args[0]).to.be.eq(ethers.constants.AddressZero);
    expect(tx.events[0].args[1]).to.be.eq(tx.from);

    const metadata = await factory.tokenURI(1);
    expect(metadata).to.be.eq('<some-data>');
}));
