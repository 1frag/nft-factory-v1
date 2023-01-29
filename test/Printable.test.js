const { ethers } = require('hardhat');
const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

async function deploy () {
    const Printable = await ethers.getContractFactory('Printable');
    const printable = await Printable.deploy();
    await printable.deployed();
    return [printable];
}

it('Printable.isPrintable()', async () => {
    const [printable] = await loadFixture(deploy);

    for (const c of [33, 126, 255, 1000, 32000]) {
        expect(await printable.isPrintable(c)).to.be.true;
    }

    for (const c of [127, 1367, 2248, 2249, 2258]) {
        expect(await printable.isPrintable(c)).to.be.false;
    }
});

it('Printable.getIthPrintable()', async () => {
    const [printable] = await loadFixture(deploy);

    expect(await printable.getIthPrintable(0)).to.be.eq(32);
    expect(await printable.getIthPrintable(2)).to.be.eq(34);
    expect(await printable.getIthPrintable(66)).to.be.eq(98);
    expect(await printable.getIthPrintable(95)).to.be.eq(161);
    expect(await printable.getIthPrintable(106)).to.be.eq(172);
    expect(await printable.getIthPrintable(107)).to.be.eq(174);
    expect(await printable.getIthPrintable(143680 - 1)).to.be.eq(917999);
    expect(await printable.getIthPrintable(143680)).to.be.eq(32);
});
