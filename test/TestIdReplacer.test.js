const { ethers } = require('hardhat');
const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

async function deploy () {
    const TestIdReplacer = await ethers.getContractFactory('TestIdReplacer');
    const testIdReplacer = await TestIdReplacer.deploy();
    await testIdReplacer.deployed();
    return [testIdReplacer];
}

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
            const [testIdReplacer] = await loadFixture(deploy);

            const value = await testIdReplacer.replaceIdInString(baseUri, tokenId);
            expect(value).to.be.eq(expected);
        }
    )
);
