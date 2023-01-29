const { ethers } = require('hardhat');
const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

async function deploy () {
    const GoodMetadataRepository = await ethers.getContractFactory('GoodMetadataRepository');
    const goodMetadataRepository = await GoodMetadataRepository.deploy();
    await goodMetadataRepository.deployed();

    const FactoryERC721 = await ethers.getContractFactory('FactoryERC721');
    const factoryERC721 = await FactoryERC721.deploy();
    await factoryERC721.deployed();
    return [factoryERC721, goodMetadataRepository]
}

it('owner of created ERC721', async function () {
    const [factoryERC721, gmr] = await loadFixture(deploy);
    const tx = await factoryERC721.create721('test721', gmr.address);
    const receipt = await tx.wait();

    const ERC721 = await ethers.getContractFactory('CustomERC721');
    const erc721 = ERC721.attach(receipt.events[0].args.addr);
    expect(await erc721.owner()).to.be.eq(factoryERC721.signer.address);
});

it('gmr of created ERC721', async function () {
    const [factoryERC721, gmr] = await loadFixture(deploy);
    const tx = await factoryERC721.create721('test721', gmr.address);
    const receipt = await tx.wait();

    const ERC721 = await ethers.getContractFactory('CustomERC721');
    const erc721 = ERC721.attach(receipt.events[0].args.addr);
    expect(await erc721.gmr()).to.be.eq(gmr.address);
});

it('name of created ERC721', async function () {
    const [factoryERC721, gmr] = await loadFixture(deploy);
    const tx = await factoryERC721.create721('test721', gmr.address);
    const receipt = await tx.wait();

    const ERC721 = await ethers.getContractFactory('CustomERC721');
    const erc721 = ERC721.attach(receipt.events[0].args.addr);
    expect(await erc721.name()).to.be.eq('test721');
});
