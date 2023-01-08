const { ethers } = require('hardhat');
const { expect } = require('chai');

async function deploy () {
    const GoodMetadataRepository = await ethers.getContractFactory('GoodMetadataRepository');
    const goodMetadataRepository = await GoodMetadataRepository.deploy();
    await goodMetadataRepository.deployed();

    const ERC1155 = await ethers.getContractFactory('CustomERC1155');
    const erc1155 = await ERC1155.deploy(goodMetadataRepository.address, 'Test');
    await erc1155.deployed();
    return [erc1155, goodMetadataRepository];
}

it('get GoodMetadataRepository address', async function () {
    const [erc1155, gmr] = await deploy();
    expect(await erc1155.gmr()).to.be.eq(gmr.address);
});

['TestERC721', 'TestERC1155'].forEach(testName => it(`Test mint v4 ${testName}`, async function () {
    const Test = await ethers.getContractFactory(testName);
    const test = await Test.deploy();
    await test.deployed();

    const [erc1155] = await deploy();

    const tx = await (await erc1155.mintV4(test.address, '5')).wait();
    expect(tx.events.length).to.be.eq(1);
    expect(tx.events[0].args.from).to.be.eq(ethers.constants.AddressZero);
    expect(tx.events[0].args.to).to.be.eq(tx.from);

    const metadata = await erc1155.uri(1);
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
            const [erc1155] = await deploy();

            const value = await erc1155.replaceIdInString(baseUri, tokenId);
            expect(value).to.be.eq(expected);
        }
    )
);

it('mintV5', async function () {
    const [erc1155] = await deploy();

    const tx = await (await erc1155.mintV5('name', 'https://random.imagecdn.app/200/200')).wait();
    expect(tx.events.length).to.be.eq(1);
    expect(tx.events[0].args.from).to.be.eq(ethers.constants.AddressZero);
    expect(tx.events[0].args.to).to.be.eq(tx.from);

    const uri = await erc1155.uri(1);
    expect(uri).to.be.eq(
        'data:application/json;utf8,{"name": "name", "image": "https://random.imagecdn.app/200/200"}'
    );
});

it('mintV6', async function () {
    const Test = await ethers.getContractFactory('TestERC721');
    const test = await Test.deploy();
    await test.deployed();

    const [erc1155] = await deploy();

    const tx = await (await erc1155.mintV6(test.address, 2, 7)).wait();
    expect(tx.events.length).to.be.eq(6);
});

it('refresh', async function () {
    const [erc1155] = await deploy();

    const tx1 = await (await erc1155.mintV1(
        '0x0000000000000000000000000000000000000123',
        ''
    )).wait();
    expect(tx1.events.length).to.be.eq(1);

    const tx2 = await (await erc1155.refresh(1)).wait();
    expect(tx2.events.length).to.be.eq(2);
    expect(tx2.events[0].args.to).to.be.eq(tx2.events[1].args.from);
    expect(tx2.events[1].args.to).to.be.eq(tx2.events[0].args.from);
    expect(tx2.events[1].args.to).to.be.eq('0x0000000000000000000000000000000000000123');
});

it('refreshAll', async function () {
    const [erc1155] = await deploy();

    for (let i = 0; i < 4; i++) {
        const tx1 = await (await erc1155.mintV1(
            '0x0000000000000000000000000000000000000123',
            ''
        )).wait();
        expect(tx1.events.length).to.be.eq(1);
    }

    const tx2 = await (await erc1155.refreshAll()).wait();
    expect(tx2.events.length).to.be.eq(8);
});
