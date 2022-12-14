const { ethers } = require('hardhat');
const { expect } = require('chai');

async function deploy () {
    const Test = await ethers.getContractFactory('TestERC721');
    const test = await Test.deploy();
    await test.deployed();

    const GoodMetadataRepository = await ethers.getContractFactory('TestGoodMetadataRepository');
    const goodMetadataRepository = await GoodMetadataRepository.deploy(test.address, 3);
    await goodMetadataRepository.deployed();

    const Factory = await ethers.getContractFactory('CondensedNFTs');
    const factory = await Factory.deploy(goodMetadataRepository.address, 'Test');
    await factory.deployed();
    return [factory, goodMetadataRepository, test]
}

it('Check CondensedNFTs marketplace functions', async function () {
    const [factory, gmr] = await deploy();

    let result;

    result = await (await factory.mintV1(2)).wait();
    expect(result.events[0].args.value).to.be.eq(2);
    expect(result.events[0].args.from).to.be.eq(ethers.constants.AddressZero);
    expect(result.events[0].args.to).to.be.eq(factory.signer.address);
    expect(result.events[0].args.id).to.be.eq(1);

    result = await (await factory.mintV2(200, 100)).wait();
    expect(result.events[0].args.value).to.be.eq(100);
    expect(result.events[0].args.from).to.be.eq(ethers.constants.AddressZero);
    expect(result.events[0].args.to).to.be.eq(factory.signer.address);
    expect(result.events[0].args.id).to.be.eq(200);

    const to = ethers.Wallet.createRandom();
    result = await (await factory.mintBatchV1(
        to.address,
        [5, 6, 70],
        [100, 200, 300],
        '0x',
    )).wait();
    expect(result.events[0].args.ids.map(v => parseInt(v))).to.eql([5, 6, 70]);
});
