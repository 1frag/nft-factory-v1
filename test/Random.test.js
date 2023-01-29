const { ethers } = require('hardhat');
const { expect } = require('chai');
const { setCode } = require("@nomicfoundation/hardhat-network-helpers");
const { getInterfaceID } = require("../scripts/utils");
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

async function deploy () {
    const TestRandom = await ethers.getContractFactory('TestRandom');
    const testRandom = await TestRandom.deploy();
    await testRandom.deployed();

    return [testRandom];
}

it('Random.randomSymbol()', async () => {
    const [testRandom] = await loadFixture(deploy);

    const Resolver = await ethers.getContractFactory('CustomResolver');
    const resolver = await Resolver.deploy();
    await resolver.deployed();

    const Printable = await ethers.getContractFactory('Printable');
    const printable = await Printable.deploy();
    await printable.deployed();

    const domain = 'ifrag-dev.ru';

    const MockENS = await ethers.getContractFactory('MockENS');
    const mockENS = await MockENS.deploy();
    await mockENS.deployed();

    const ensAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
    await setCode(ensAddress, await ethers.provider.getCode(mockENS.address));
    const ens = MockENS.attach(ensAddress);
    await (await ens.setResolver(
        ethers.utils.namehash(domain),
        resolver.address
    )).wait();

    await (await resolver.setInterfaceImplementer(
        await getInterfaceID('IPrintable'),
        printable.address,
    )).wait();

    expect(await testRandom.randomSymbol()).to.be.any;
});
