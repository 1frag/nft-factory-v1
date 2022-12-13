const { ethers } = require('hardhat');
const { expect } = require('chai');

async function deploy () {
    const GoodMetadataRepository = await ethers.getContractFactory('GoodMetadataRepository');
    const goodMetadataRepository = await GoodMetadataRepository.deploy();
    await goodMetadataRepository.deployed();

    const Factory = await ethers.getContractFactory('Factory721');
    const factory = await Factory.deploy(goodMetadataRepository.address, 'Test');
    await factory.deployed();
    return [factory, goodMetadataRepository]
}

it('mintV3', async function () {
    const Test = await ethers.getContractFactory('TestERC721');
    const test = await Test.deploy();
    await test.deployed();

    const TestGoodMetadataRepository = await ethers.getContractFactory('TestGoodMetadataRepository');
    const testGoodMetadataRepository = await TestGoodMetadataRepository.deploy(test.address, 3);
    await testGoodMetadataRepository.deployed();

    const Factory = await ethers.getContractFactory('Factory721');
    const factory = await Factory.deploy(testGoodMetadataRepository.address, 'Test');
    await factory.deployed();

    await factory.mintV3();
});

it('get GoodMetadataRepository address', async function () {
    const [factory, gmr] = await deploy();
    expect(await factory.gmr()).to.be.eq(gmr.address);
});

['TestERC721', 'TestERC1155'].forEach(testName => it(`Test mint v4 ${testName}`, async function () {
    const Test = await ethers.getContractFactory(testName);
    const test = await Test.deploy();
    await test.deployed();

    const [factory] = await deploy();

    const tx = await (await factory.mintV4(test.address, '5')).wait();
    expect(tx.events.length).to.be.eq(1);
    expect(tx.events[0].args[0]).to.be.eq(ethers.constants.AddressZero);
    expect(tx.events[0].args[1]).to.be.eq(tx.from);

    const metadata = await factory.tokenURI(1);
    expect(metadata).to.be.eq('<some-data>');
}));

[
    {
        baseUri: 'https://game.io/item/{id}.json',
        tokenId: '1',
        expected: 'https://game.io/item/0000000000000000000000000000000000000000000000000000000000000001.json',
    },
    {
        baseUri: 'https://game.io/item/{id}',
        tokenId: '1234567890123456789012345678901234567890123456789012345678901234567890',
        expected: 'https://game.io/item/0000002dcaec4c2df4268937664439ba2f162fc2d76998cbaccff196ce3f0ad2',
    },
].forEach(
    ({tokenId, baseUri, expected}) => it(
        `Test replaceIdInString(${baseUri}, ${tokenId})`,
        async function () {
            const [factory] = await deploy();

            const value = await factory.replaceIdInString(baseUri, tokenId);
            expect(value).to.be.eq(expected);
        }
    )
);

it('mintV5', async function () {
    const [factory] = await deploy();

    const tx = await (await factory.mintV5('name', 'https://random.imagecdn.app/200/200')).wait();
    expect(tx.events.length).to.be.eq(1);
    expect(tx.events[0].args[0]).to.be.eq(ethers.constants.AddressZero);
    expect(tx.events[0].args[1]).to.be.eq(tx.from);

    const uri = await factory.tokenURI(1);
    expect(uri).to.be.eq(
        'data:application/json;utf8,{"name": "name", "image": "https://random.imagecdn.app/200/200"}'
    );
});

it('mintV6', async function () {
    const Test = await ethers.getContractFactory('TestERC721');
    const test = await Test.deploy();
    await test.deployed();

    const [factory] = await deploy();

    const tx = await (await factory.mintV6(test.address, 2, 7)).wait();
    expect(tx.events.length).to.be.eq(6);
});

it('refresh', async function () {
    const [factory] = await deploy();

    const tx1 = await (await factory.mintV1(
        '0x0000000000000000000000000000000000000123',
        ''
    )).wait();
    expect(tx1.events.length).to.be.eq(1);

    const tx2 = await (await factory.refresh(1)).wait();
    expect(tx2.events.length).to.be.eq(2);
    expect(tx2.events[0].args._to).to.be.eq(tx2.events[1].args._from);
    expect(tx2.events[1].args._to).to.be.eq(tx2.events[0].args._from);
    expect(tx2.events[1].args._to).to.be.eq('0x0000000000000000000000000000000000000123');
});

it('refreshAll', async function () {
    const [factory] = await deploy();

    for (let i = 0; i < 4; i++) {
        const tx1 = await (await factory.mintV1(
            '0x0000000000000000000000000000000000000123',
            ''
        )).wait();
        expect(tx1.events.length).to.be.eq(1);
    }

    const tx2 = await (await factory.refreshAll()).wait();
    expect(tx2.events.length).to.be.eq(8);
});
