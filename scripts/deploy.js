const fs = require('fs');
const hre = require("hardhat");

const deployed = {
    GoodMetadataRepository: '0xE621A818728281B3E1794778d06fD9495B7DAC2c',
    BuilderV1: '0xA2b7db50F8a6B2E23eb958c582fBDa12719f6fbd',
    BuilderV2: '0x053B9eC72Fa9b74a827e23A1F5d6D9e23DdaD77e',
    BuilderV3: '0xC9441ac66f20D9531Db922653a1BfEf430b52213',
    BuilderV4: '0xA0F115C93762af4473B09A93db99235332245715',
    BuilderV5: '0x6F3a6CbefD6dB1E326bCd48f22fA4EBe6cB3f827',
    ComposableBuilderV1: '0x4a6624ae8293078ccc2da70712980344c3438b8b',
    Factory721: '0x4b24deebac7592572253acc94b0b01a77adf22a4',
    Factory1155: '0xb9a499150114ff097cc2041ddf32b4075fe9d05b',
    CondensedNFTs: '0xa3aca6ea5ce6956cdf24097e3c97645259fdd2da',
    CustomOwnable: '0xbFc09a532689D58F89d0DB7BC86ea2e6cdbB6Bc7',
};

async function ifNotDeployed (alias, callback) {
    if (!deployed[alias]) {
        console.log(`Deploying ${alias}`);
        const contract = await callback();
        deployed[alias] = contract.address;
        console.log(`${alias} deployed to:`, deployed[alias]);
    }
    const factory = await hre.ethers.getContractFactory(alias);
    return factory.attach(deployed[alias]);
}

function deriveAddress (receipt) {
    return receipt.events[0].data.replace('0x000000000000000000000000', '0x');
}

class ContactVerifications {
    constructor() {
        this.verifications = [];
        this._network = 'goerli';
    }

    _buildOptionsForComplexArgs (contactAddress, args) {
        fs.writeFileSync(
            `./arguments/${contactAddress}.js`,
            'module.exports = ' + JSON.stringify(args, null, 2) + ';\n',
            {flag: 'w'}
        );
        return [
            '--constructor-args',
            `arguments/${contactAddress}.js`,
        ];
    }

    add (contactAddress, ...args) {
        let options = [];
        if (args.filter(v => typeof v !== 'string').length) {
            options = this._buildOptionsForComplexArgs(contactAddress, args);
            args = [];
        }
        const command = 'npx hardhat verify ' +
            `--network ${this._network} ` +
            `${options.join(' ')} ` +
            `${contactAddress} ` +
            args.join(' ');
        this.verifications.push(command.trim());
    }

    print () {
        console.log(this.verifications.join('\n'));
    }
}

async function main() {
    const verify = new ContactVerifications();

    const gmr = await ifNotDeployed('GoodMetadataRepository', async () => {
        const GoodMetadataRepository = await hre.ethers.getContractFactory('GoodMetadataRepository');
        const gmr = await GoodMetadataRepository.deploy();
        return gmr.deployed();
    });
    verify.add(gmr.address);

    const factoryBuilder1 = await ifNotDeployed('BuilderV1', async () => {
        const FactoryBuilder1 = await hre.ethers.getContractFactory('BuilderV1');
        const factoryBuilder1 = await FactoryBuilder1.deploy();
        return factoryBuilder1.deployed();
    });
    verify.add(factoryBuilder1.address);

    const factoryBuilder2 = await ifNotDeployed('BuilderV2', async () => {
        const FactoryBuilder2 = await hre.ethers.getContractFactory('BuilderV2');
        const factoryBuilder2 = await FactoryBuilder2.deploy();
        return factoryBuilder2.deployed();
    });
    verify.add(factoryBuilder2.address);

    const factoryBuilder3 = await ifNotDeployed('BuilderV3', async () => {
        const FactoryBuilder3 = await hre.ethers.getContractFactory('BuilderV3');
        const factoryBuilder3 = await FactoryBuilder3.deploy();
        return factoryBuilder3.deployed();
    });
    verify.add(factoryBuilder3.address);

    const factoryBuilder4 = await ifNotDeployed('BuilderV4', async () => {
        const FactoryBuilder4 = await hre.ethers.getContractFactory('BuilderV4');
        const factoryBuilder4 = await FactoryBuilder4.deploy();
        return factoryBuilder4.deployed();
    });
    verify.add(factoryBuilder4.address);

    const factoryBuilder5 = await ifNotDeployed('BuilderV5', async () => {
        const FactoryBuilder5 = await hre.ethers.getContractFactory('BuilderV5');
        const factoryBuilder5 = await FactoryBuilder5.deploy();
        return factoryBuilder5.deployed();
    });
    verify.add(factoryBuilder5.address);

    const builders = [
        factoryBuilder1.address,
        factoryBuilder2.address,
        factoryBuilder3.address,
        factoryBuilder4.address,
    ];
    const composableBuilderV1 = await ifNotDeployed('ComposableBuilderV1', async () => {
        const ComposableBuilderV1 = await hre.ethers.getContractFactory('ComposableBuilderV1');
        const composableBuilderV1 = await ComposableBuilderV1.deploy(
            gmr.address, builders,
        );
        return composableBuilderV1.deployed();
    });
    verify.add(composableBuilderV1.address, gmr.address, builders);

    const address721 = await ifNotDeployed('Factory721', async () => {
        const receipt721 = await (await composableBuilderV1.create721('test721')).wait();
        return {address: deriveAddress(receipt721)};
    });
    verify.add(address721.address, gmr.address, 'test721');

    const address1155 = await ifNotDeployed('Factory1155', async () => {
        const receipt1155 = await (await composableBuilderV1.create1155('test1155')).wait();
        return {address: deriveAddress(receipt1155)};
    });
    verify.add(address1155.address, gmr.address, 'test1155');

    const addressCondensed = await ifNotDeployed('CondensedNFTs', async () => {
        const receiptCondensed = await (await composableBuilderV1.createCondensed('testCondensed')).wait();
        return {address: deriveAddress(receiptCondensed)};
    });
    verify.add(addressCondensed.address, gmr.address, 'testCondensed');

    const customOwnable = await ifNotDeployed('CustomOwnable', async () => {
        const CustomOwnable = await hre.ethers.getContractFactory('CustomOwnable');
        const customOwnable = await CustomOwnable.deploy();
        return customOwnable.deployed();
    });
    verify.add(customOwnable.address);

    verify.print();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
