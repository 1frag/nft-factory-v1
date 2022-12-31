const { ethers } = require('hardhat');
const { expect } = require('chai');

async function deploy () {
    const Test = await ethers.getContractFactory('TestERC721');
    const test = await Test.deploy();
    await test.deployed();

    const TestGoodMetadataRepository = await ethers.getContractFactory('TestGoodMetadataRepository');
    const testGoodMetadataRepository = await TestGoodMetadataRepository.deploy(test.address, 3);
    await testGoodMetadataRepository.deployed();

    const BuilderV4 = await ethers.getContractFactory('BuilderV4');
    const builderV4 = await BuilderV4.deploy();
    await builderV4.deployed();
    return [builderV4, testGoodMetadataRepository];
}

it('BuilderV4.multiCreate', async () => {
    const Factory721 = await ethers.getContractFactory('Factory721');
    const [builder, gmr] = await deploy();
    const tx = await builder.multiCreate('test', 2, 4, gmr.address);
    const origin = ethers.utils.defaultAbiCoder.encode(['uint'], [tx.from]);
    const receipt = await tx.wait();
    expect(receipt.events.length).to.be.eq(10);

    expect(receipt.events[0].event).to.be.eq('Deployed');
    const first = receipt.events[0].args.addr;
    const firstFactory = Factory721.attach(first);
    expect(await firstFactory.name()).to.be.eq('test 1');
    for (let i = 1; i < 5; i++) {
        expect(receipt.events[i].address).to.be.eq(first);
        expect(receipt.events[i].topics[1]).to.be.eq(ethers.constants.HashZero);
        expect(receipt.events[i].topics[2]).to.be.eq(origin);
    }

    expect(receipt.events[5].event).to.be.eq('Deployed');
    const second = receipt.events[5].args.addr;
    const secondFactory = Factory721.attach(second);
    expect(await secondFactory.name()).to.be.eq('test 2');
    for (let i = 6; i < 10; i++) {
        expect(receipt.events[i].address).to.be.eq(second);
        expect(receipt.events[i].topics[1]).to.be.eq(ethers.constants.HashZero);
        expect(receipt.events[i].topics[2]).to.be.eq(origin);
    }
});
