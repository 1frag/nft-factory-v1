const { ethers } = require('hardhat');
const { expect } = require('chai');

async function deploy () {
    const GoodMetadataRepository = await ethers.getContractFactory('GoodMetadataRepository');
    const goodMetadataRepository = await GoodMetadataRepository.deploy();
    await goodMetadataRepository.deployed();

    const BuilderERC721 = await ethers.getContractFactory('BuilderERC721');
    const builderERC721 = await BuilderERC721.deploy();
    await builderERC721.deployed();
    return [builderERC721, goodMetadataRepository]
}

it('owner of created Factory721', async function () {
    const [builderERC721, gmr] = await deploy();
    const tx = await builderERC721.create721('test721', gmr.address);
    const receipt = await tx.wait();

    const Factory721 = await ethers.getContractFactory('Factory721');
    const factory = Factory721.attach(receipt.events[0].args.addr);
    expect(await factory.owner()).to.be.eq(builderERC721.signer.address);
});

it('gmr of created Factory721', async function () {
    const [builderERC721, gmr] = await deploy();
    const tx = await builderERC721.create721('test721', gmr.address);
    const receipt = await tx.wait();

    const Factory721 = await ethers.getContractFactory('Factory721');
    const factory = Factory721.attach(receipt.events[0].args.addr);
    expect(await factory.gmr()).to.be.eq(gmr.address);
});

it('name of created Factory721', async function () {
    const [builderERC721, gmr] = await deploy();
    const tx = await builderERC721.create721('test721', gmr.address);
    const receipt = await tx.wait();

    const Factory721 = await ethers.getContractFactory('Factory721');
    const factory = Factory721.attach(receipt.events[0].args.addr);
    expect(await factory.name()).to.be.eq('test721');
});
