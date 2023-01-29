const { ethers } = require('hardhat');
const { expect } = require('chai');
const { setBalance } = require("@nomicfoundation/hardhat-network-helpers");

async function deploy () {
    const LeaderBoard = await ethers.getContractFactory('NuanceLeaderBoard');
    const leaderBoard = await LeaderBoard.deploy();
    await leaderBoard.deployed();

    const Currency = await ethers.getContractFactory('NuanceCurrency');
    const currency = await Currency.deploy();
    await currency.deployed();

    return [leaderBoard, currency];
}

it('Positive case nuance (many addresses)', async () => {
    const [leaderBoard, currency] = await deploy();
    await (await currency.setLeaderBoard(leaderBoard.address)).wait();

    const balance = [
        3, 8, 2, 6, 10,
        19, 1, 100, 4, 9,
        90, 11, 12, 111, 5,
    ];
    const addresses = [];

    for (let i = 0; i < 15; i++) {
        const wallet = ethers.Wallet.createRandom();
        addresses.push(wallet.address);
        const signer = await wallet.connect(ethers.provider);
        await setBalance(wallet.address, ethers.BigNumber.from(10).pow(18));
        await (await currency.connect(signer).mint(balance[i])).wait();
    }

    const sortedByBalance = balance
        .map((b, i) => [b, i])
        .sort((a, b) => b[0] - a[0])
        .map(c => addresses[c[1]]);

    for (let i = 1; i <= 10; i++) {
        expect(await leaderBoard.ownerOf(i)).to.be.eq(sortedByBalance[i - 1]);
    }
});

it.skip('Positive case nuance (mint + transfer)', async () => {
    const dead = '0x000000000000000000000000000000000000dEaD';

    const [leaderBoard, currency] = await deploy();
    await (await currency.setLeaderBoard(leaderBoard.address)).wait();

    const wallet = ethers.Wallet.createRandom();
    const signer = await wallet.connect(ethers.provider);
    const one = ethers.BigNumber.from(10).pow(18);
    await setBalance(wallet.address, one);
    await (await currency.connect(signer).mint(one)).wait();

    await (await currency.connect(signer).transfer(dead, one)).wait();

    await (await currency.connect(signer).mint(1)).wait();

    for (let i = 1; i <= 4; i++) {
        console.log(i, await leaderBoard.ownerOf(i).catch(() => {}));
    }
});
