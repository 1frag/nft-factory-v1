const { ethers } = require('hardhat');
const { expect } = require('chai');

async function deploy () {
    const GoodMetadataRepository = await ethers.getContractFactory('GoodMetadataRepository');
    const goodMetadataRepository = await GoodMetadataRepository.deploy();
    await goodMetadataRepository.deployed();

    const BuilderV1 = await ethers.getContractFactory('BuilderV1');
    const builderV1 = await BuilderV1.deploy();
    await builderV1.deployed();
    return [builderV1, goodMetadataRepository]
}

it('owner of created Factory721', async function () {
    const [builderV1, gmr] = await deploy();
    const tx = await builderV1.create721('test721', gmr.address);
    const receipt = await tx.wait();

    const Factory721 = await ethers.getContractFactory('Factory721');
    const factory = Factory721.attach(receipt.events[0].args.addr);
    expect(await factory.owner()).to.be.eq(builderV1.signer.address);
});

it('gmr of created Factory721', async function () {
    const [builderV1, gmr] = await deploy();
    const tx = await builderV1.create721('test721', gmr.address);
    const receipt = await tx.wait();

    const Factory721 = await ethers.getContractFactory('Factory721');
    const factory = Factory721.attach(receipt.events[0].args.addr);
    expect(await factory.gmr()).to.be.eq(gmr.address);
});

it('name of created Factory721', async function () {
    const [builderV1, gmr] = await deploy();
    const tx = await builderV1.create721('test721', gmr.address);
    const receipt = await tx.wait();

    const Factory721 = await ethers.getContractFactory('Factory721');
    const factory = Factory721.attach(receipt.events[0].args.addr);
    expect(await factory.name()).to.be.eq('test721');
});
