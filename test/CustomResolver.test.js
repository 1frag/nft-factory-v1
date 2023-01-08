const { ethers } = require('hardhat');
const { expect } = require('chai');
const { setCode } = require('@nomicfoundation/hardhat-network-helpers');

const CUSTOM_RESOLVER_INTERFACE_ID = '0xee416f7e';

async function deploy () {
    const Resolver = await ethers.getContractFactory('CustomResolver');
    const resolver = await Resolver.deploy();
    await resolver.deployed();

    return [resolver];
}

it('CustomResolver.setInterfaceImplementer()', async () => {
    const [resolver] = await deploy();

    const testInterfaceId = '0x12345678';
    const testAddress = '0x0000000000000000000000000000000000000123';
    await (await resolver.setInterfaceImplementer(testInterfaceId, testAddress)).wait();

    expect(await resolver.interfaceImplementer(CUSTOM_RESOLVER_INTERFACE_ID)).to.be.eq(resolver.address);
    expect(await resolver.interfaceImplementer(testInterfaceId)).to.be.eq(testAddress);
});

it('CustomResolver.resolverAddress()', async () => {
    const [resolver] = await deploy();

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

    expect(await resolver.resolverAddress()).to.be.eq(resolver.address);
});
