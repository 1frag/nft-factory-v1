const {getInterfaceID} = require('../scripts/utils');
const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

it('getInterfaceID()', async () => {
    expect(await getInterfaceID('ICustomResolver')).to.be.eq('0xee416f7e')
    expect(await getInterfaceID('IPrintable')).to.be.eq('0x7104ac27')
});
