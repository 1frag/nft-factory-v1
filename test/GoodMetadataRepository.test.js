const { expect } = require('chai');
const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

async function deploy () {
    const GoodMetadataRepository = await ethers.getContractFactory('GoodMetadataRepository');
    const goodMetadataRepository = await GoodMetadataRepository.deploy();
    await goodMetadataRepository.deployed();

    return [goodMetadataRepository];
}

it('Test adding metadata clone', async function () {
    const [gmr] = await loadFixture(deploy);

    const state = await gmr.hashState();
    await (await gmr.add('0x61e2d70388b191d807918de5c2bea9af09c64753', '5', true)).wait();

    expect(state.eq(await gmr.hashState())).not.to.be.ok;
});
