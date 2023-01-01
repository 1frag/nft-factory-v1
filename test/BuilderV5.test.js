const { ethers } = require('hardhat');
const { expect } = require('chai');
const crypto = require('crypto');

const randomAddress = () => '0x' + crypto.randomBytes(20).toString('hex');

it('BuilderV5.manualCreate', async () => {
    const BuilderV5 = await ethers.getContractFactory('BuilderV5');
    const builderV5 = await BuilderV5.deploy();
    await builderV5.deployed();

    const address1 = randomAddress();
    const address2 = randomAddress();
    const address3 = randomAddress();
    const tx = await builderV5.manualCreate([address1, address2, address3]);
    const receipt = await tx.wait();

    expect(receipt.events.length).to.be.eq(3);
    expect(receipt.events.map(evt => evt.args.addr.toLowerCase())).to.be.eql(
        [address1, address2, address3]
    );
});
