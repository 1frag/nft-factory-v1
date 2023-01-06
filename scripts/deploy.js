const fs = require('fs');
const hre = require("hardhat");

const deployed = require('./deployed.json');

async function ifNotDeployed (alias, callback) {
    if (!deployed[alias]) {
        console.log(`Deploying ${alias}`);
        const contract = await callback();
        deployed[alias] = contract.address;
        verify.deployed(contract.address);
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
        this.deployedAddresses = new Set();
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

    setArgs (contactAddress, ...args) {
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
        this.verifications.push([contactAddress, command.trim()]);
    }

    deployed (contactAddress) {
        this.deployedAddresses.add(contactAddress);
    }

    print () {
        console.log(
            this.verifications
                .filter(([address]) => this.deployedAddresses.has(address))
                .map(([_, command]) => command)
                .join('\n')
        );
    }
}

const verify = new ContactVerifications();

async function main() {
    const gmr = await ifNotDeployed('GoodMetadataRepository', async () => {
        const GoodMetadataRepository = await hre.ethers.getContractFactory('GoodMetadataRepository');
        const gmr = await GoodMetadataRepository.deploy();
        return gmr.deployed();
    });
    verify.setArgs(gmr.address);

    const builderERC721 = await ifNotDeployed('BuilderERC721', async () => {
        const FactoryBuilder1 = await hre.ethers.getContractFactory('BuilderERC721');
        const factoryBuilder1 = await FactoryBuilder1.deploy();
        return factoryBuilder1.deployed();
    });
    verify.setArgs(builderERC721.address);

    const builderERC1155 = await ifNotDeployed('BuilderERC1155', async () => {
        const BuilderERC1155 = await hre.ethers.getContractFactory('BuilderERC1155');
        const builderERC1155 = await BuilderERC1155.deploy();
        return builderERC1155.deployed();
    });
    verify.setArgs(builderERC1155.address);

    const builderCondensed = await ifNotDeployed('BuilderCondensed', async () => {
        const BuilderCondensed = await hre.ethers.getContractFactory('BuilderCondensed');
        const builderCondensed = await BuilderCondensed.deploy();
        return builderCondensed.deployed();
    });
    verify.setArgs(builderCondensed.address);

    const factoryBuilder5 = await ifNotDeployed('DeployedMigration', async () => {
        const FactoryBuilder5 = await hre.ethers.getContractFactory('DeployedMigration');
        const factoryBuilder5 = await FactoryBuilder5.deploy();
        return factoryBuilder5.deployed();
    });
    verify.setArgs(factoryBuilder5.address);

    const builders = [
        builderERC721.address,
        builderERC1155.address,
        builderCondensed.address,
    ];
    const facade = await ifNotDeployed('Facade', async () => {
        const Facade = await hre.ethers.getContractFactory('Facade');
        const facade = await Facade.deploy(
            gmr.address, builders,
        );
        return facade.deployed();
    });
    verify.setArgs(facade.address, gmr.address, builders);

    const address721 = await ifNotDeployed('Factory721', async () => {
        const receipt721 = await (await facade.create721('test721')).wait();
        return {address: deriveAddress(receipt721)};
    });
    verify.setArgs(address721.address, gmr.address, 'test721');

    const address1155 = await ifNotDeployed('Factory1155', async () => {
        const receipt1155 = await (await facade.create1155('test1155')).wait();
        return {address: deriveAddress(receipt1155)};
    });
    verify.setArgs(address1155.address, gmr.address, 'test1155');

    const addressCondensed = await ifNotDeployed('CondensedNFTs', async () => {
        const receiptCondensed = await (await facade.createCondensed('testCondensed')).wait();
        return {address: deriveAddress(receiptCondensed)};
    });
    verify.setArgs(addressCondensed.address, gmr.address, 'testCondensed');

    const customOwnable = await ifNotDeployed('CustomOwnable', async () => {
        const CustomOwnable = await hre.ethers.getContractFactory('CustomOwnable');
        const customOwnable = await CustomOwnable.deploy();
        return customOwnable.deployed();
    });
    verify.setArgs(customOwnable.address);

    verify.print();
    fs.writeFileSync(
        `./deployed.json`,
        JSON.stringify(deployed, null, 2) + '\n',
        {flag: 'w'}
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
