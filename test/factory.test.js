const { ethers } = require('hardhat');
const { expect } = require('chai');

it('Test adding metadata clone', async function () {
    const Factory = await ethers.getContractFactory('Factory');
    const factory = await Factory.deploy();
    await factory.deployed();

    const state = await factory.hashState();
    await (await factory.addMetadataClone('0x61e2d70388b191d807918de5c2bea9af09c64753', '5')).wait();

    expect(state.eq(await factory.hashState())).not.to.be.ok;
});

['TestERC721', 'TestERC1155'].forEach(testName => it(`Test mint v4 ${testName}`, async function () {
    const Test = await ethers.getContractFactory(testName);
    const test = await Test.deploy();
    await test.deployed();

    const Factory = await ethers.getContractFactory('Factory');
    const factory = await Factory.deploy();
    await factory.deployed();

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
            const Factory = await ethers.getContractFactory('Factory');
            const factory = await Factory.deploy();
            await factory.deployed();

            const value = await factory.replaceIdInString(baseUri, tokenId);
            expect(value).to.be.eq(expected);
        }
    )
);
