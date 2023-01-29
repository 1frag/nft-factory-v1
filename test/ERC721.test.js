const { ethers } = require('hardhat');
const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

async function deploy () {
    const GoodMetadataRepository = await ethers.getContractFactory('GoodMetadataRepository');
    const goodMetadataRepository = await GoodMetadataRepository.deploy();
    await goodMetadataRepository.deployed();

    const ERC721 = await ethers.getContractFactory('CustomERC721');
    const erc721 = await ERC721.deploy(goodMetadataRepository.address, 'Test');
    await erc721.deployed();
    return [erc721, goodMetadataRepository]
}

it('mintV3', async function () {
    const Test = await ethers.getContractFactory('TestERC721');
    const test = await Test.deploy();
    await test.deployed();

    const TestGoodMetadataRepository = await ethers.getContractFactory('TestGoodMetadataRepository');
    const testGoodMetadataRepository = await TestGoodMetadataRepository.deploy(test.address, 3);
    await testGoodMetadataRepository.deployed();

    const Factory = await ethers.getContractFactory('CustomERC721');
    const factory = await Factory.deploy(testGoodMetadataRepository.address, 'Test');
    await factory.deployed();

    await factory.mintV3();
});

it('get GoodMetadataRepository address', async function () {
    const [erc721, gmr] = await loadFixture(deploy);
    expect(await erc721.gmr()).to.be.eq(gmr.address);
});

['TestERC721', 'TestERC1155'].forEach(testName => it(`Test mint v4 ${testName}`, async function () {
    const [erc721] = await loadFixture(deploy);

    const Test = await ethers.getContractFactory(testName);
    const test = await Test.deploy();
    await test.deployed();

    await expect(erc721.mintV4(test.address, '5'))
        .to.emit(erc721, 'Transfer')
        .withArgs(
            ethers.constants.AddressZero,
            (await ethers.getSigners())[0].address,
            1,
        );

    const metadata = await erc721.tokenURI(1);
    expect(metadata).to.be.eq('<some-data>');
}));

it('mintV5', async function () {
    const [erc721] = await loadFixture(deploy);

    const tx = await (await erc721.mintV5('name', 'https://random.imagecdn.app/200/200')).wait();
    expect(tx.events.length).to.be.eq(1);
    expect(tx.events[0].args[0]).to.be.eq(ethers.constants.AddressZero);
    expect(tx.events[0].args[1]).to.be.eq(tx.from);

    const uri = await erc721.tokenURI(1);
    expect(uri).to.be.eq(
        'data:application/json;utf8,{"name": "name", "image": "https://random.imagecdn.app/200/200"}'
    );
});

it('mintV6', async function () {
    const [erc721] = await loadFixture(deploy);

    const Test = await ethers.getContractFactory('TestERC721');
    const test = await Test.deploy();
    await test.deployed();

    const tx = await (await erc721.mintV6(test.address, 2, 7)).wait();
    expect(tx.events.length).to.be.eq(6);
});

it('refresh', async function () {
    const [erc721] = await loadFixture(deploy);

    const tx1 = await (await erc721.mintV1(
        '0x0000000000000000000000000000000000000123',
        ''
    )).wait();
    expect(tx1.events.length).to.be.eq(1);

    const tx2 = await (await erc721.refresh(1)).wait();
    expect(tx2.events.length).to.be.eq(2);
    expect(tx2.events[0].args._to).to.be.eq(tx2.events[1].args._from);
    expect(tx2.events[1].args._to).to.be.eq(tx2.events[0].args._from);
    expect(tx2.events[1].args._to).to.be.eq('0x0000000000000000000000000000000000000123');
});

it('refreshAll', async function () {
    const [erc721] = await loadFixture(deploy);

    for (let i = 0; i < 4; i++) {
        const tx1 = await (await erc721.mintV1(
            '0x0000000000000000000000000000000000000123',
            ''
        )).wait();
        expect(tx1.events.length).to.be.eq(1);
    }

    const tx2 = await (await erc721.refreshAll()).wait();
    expect(tx2.events.length).to.be.eq(8);
});
