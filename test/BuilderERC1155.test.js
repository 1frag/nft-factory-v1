const { ethers } = require('hardhat');
const { expect } = require('chai');

async function deploy () {
    const GoodMetadataRepository = await ethers.getContractFactory('GoodMetadataRepository');
    const goodMetadataRepository = await GoodMetadataRepository.deploy();
    await goodMetadataRepository.deployed();

    const FactoryERC1155 = await ethers.getContractFactory('FactoryERC1155');
    const factoryERC1155 = await FactoryERC1155.deploy();
    await factoryERC1155.deployed();
    return [factoryERC1155, goodMetadataRepository]
}

it('owner of created ERC1155', async function () {
    const [factoryERC1155, gmr] = await deploy();
    const tx = await factoryERC1155.create1155('test1155', gmr.address);
    const receipt = await tx.wait();

    const ERC1155 = await ethers.getContractFactory('CustomERC1155');
    const erc1155 = ERC1155.attach(receipt.events[0].args.addr);
    expect(await erc1155.owner()).to.be.eq(factoryERC1155.signer.address);
});

it('gmr of created ERC1155', async function () {
    const [factoryERC1155, gmr] = await deploy();
    const tx = await factoryERC1155.create1155('test1155', gmr.address);
    const receipt = await tx.wait();

    const ERC1155 = await ethers.getContractFactory('CustomERC1155');
    const erc1155 = ERC1155.attach(receipt.events[0].args.addr);
    expect(await erc1155.gmr()).to.be.eq(gmr.address);
});

it('name of created ERC1155', async function () {
    const [factoryERC1155, gmr] = await deploy();
    const tx = await factoryERC1155.create1155('test1155', gmr.address);
    const receipt = await tx.wait();

    const ERC1155 = await ethers.getContractFactory('CustomERC1155');
    const erc1155 = ERC1155.attach(receipt.events[0].args.addr);
    expect(await erc1155.name()).to.be.eq('test1155');
});
