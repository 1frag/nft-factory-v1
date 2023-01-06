const { ethers } = require('hardhat');
const { expect } = require('chai');

async function deploy () {
    const GoodMetadataRepository = await ethers.getContractFactory('GoodMetadataRepository');
    const goodMetadataRepository = await GoodMetadataRepository.deploy();
    await goodMetadataRepository.deployed();

    const BuilderERC1155 = await ethers.getContractFactory('BuilderERC1155');
    const builderERC1155 = await BuilderERC1155.deploy();
    await builderERC1155.deployed();
    return [builderERC1155, goodMetadataRepository]
}

it('owner of created Factory1155', async function () {
    const [builderERC1155, gmr] = await deploy();
    const tx = await builderERC1155.create1155('test1155', gmr.address);
    const receipt = await tx.wait();

    const Factory1155 = await ethers.getContractFactory('Factory1155');
    const factory = Factory1155.attach(receipt.events[0].args.addr);
    expect(await factory.owner()).to.be.eq(builderERC1155.signer.address);
});

it('gmr of created Factory1155', async function () {
    const [builderERC1155, gmr] = await deploy();
    const tx = await builderERC1155.create1155('test1155', gmr.address);
    const receipt = await tx.wait();

    const Factory1155 = await ethers.getContractFactory('Factory1155');
    const factory = Factory1155.attach(receipt.events[0].args.addr);
    expect(await factory.gmr()).to.be.eq(gmr.address);
});

it('name of created Factory1155', async function () {
    const [builderERC1155, gmr] = await deploy();
    const tx = await builderERC1155.create1155('test1155', gmr.address);
    const receipt = await tx.wait();

    const Factory1155 = await ethers.getContractFactory('Factory1155');
    const factory = Factory1155.attach(receipt.events[0].args.addr);
    expect(await factory.name()).to.be.eq('test1155');
});
