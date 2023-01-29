const { ethers } = require('hardhat');
const { expect } = require('chai');
const crypto = require('crypto');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

const randomAddress = () => '0x' + crypto.randomBytes(20).toString('hex');

it('DeployedMigration.manualCreate', async () => {
    const DeployedMigration = await ethers.getContractFactory('DeployedMigration');
    const deployedMigration = await DeployedMigration.deploy();
    await deployedMigration.deployed();

    const address1 = randomAddress();
    const address2 = randomAddress();
    const address3 = randomAddress();
    const tx = await deployedMigration.manualCreate([address1, address2, address3]);
    const receipt = await tx.wait();

    expect(receipt.events.length).to.be.eq(3);
    expect(receipt.events.map(evt => evt.args.addr.toLowerCase())).to.be.eql(
        [address1, address2, address3]
    );
});
