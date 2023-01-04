const { ethers } = require('hardhat');
const { expect } = require('chai');

async function deploy () {
    const CustomOwnable = await ethers.getContractFactory('CustomOwnable');
    const customOwnable = await CustomOwnable.deploy();
    await customOwnable.deployed();

    return [customOwnable];
}

it('CustomOwnable.deriveAddress', async () => {
    const [customOwnable] = await deploy();
    const wallet = ethers.Wallet.createRandom();
    expect(await customOwnable.deriveAddress(wallet.privateKey)).to.be.eq(wallet.address);
});

it('CustomOwnable.owner', async () => {
    const {timestamp: from} = await ethers.provider.getBlock('latest');

    const [customOwnable] = await deploy();
    const ownerInContract = await customOwnable.owner();

    const {timestamp: to} = await ethers.provider.getBlock('latest');

    for (let i = Math.floor(from / 10); i <= Math.ceil(to / 10); i++) {
        const privKey = ethers.utils.defaultAbiCoder.encode(['uint'], [i]);
        const walletAddress = new ethers.Wallet(privKey).address;
        if (ownerInContract === walletAddress) {
            return;
        }
    }
    expect(false).to.be.true;
});

it('CustomOwnable.mint', async () => {
    const [customOwnable] = await deploy();
    const tx = await customOwnable.mint();
    const receipt = await tx.wait();

    expect(receipt.events.length).to.be.eq(1);
    expect(receipt.events[0].args.to).to.be.eq(tx.from);
});
