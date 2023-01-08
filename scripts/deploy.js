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
    const Factory = await hre.ethers.getContractFactory(alias);
    return Factory.attach(deployed[alias]);
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

    const factoryERC721 = await ifNotDeployed('FactoryERC721', async () => {
        const FactoryBuilder1 = await hre.ethers.getContractFactory('FactoryERC721');
        const factoryBuilder1 = await FactoryBuilder1.deploy();
        return factoryBuilder1.deployed();
    });
    verify.setArgs(factoryERC721.address);

    const factoryERC1155 = await ifNotDeployed('FactoryERC1155', async () => {
        const FactoryERC1155 = await hre.ethers.getContractFactory('FactoryERC1155');
        const factoryERC1155 = await FactoryERC1155.deploy();
        return factoryERC1155.deployed();
    });
    verify.setArgs(factoryERC1155.address);

    const factoryCondensed = await ifNotDeployed('FactoryCondensed', async () => {
        const FactoryCondensed = await hre.ethers.getContractFactory('FactoryCondensed');
        const factoryCondensed = await FactoryCondensed.deploy();
        return factoryCondensed.deployed();
    });
    verify.setArgs(factoryCondensed.address);

    const factoryBuilder5 = await ifNotDeployed('DeployedMigration', async () => {
        const FactoryBuilder5 = await hre.ethers.getContractFactory('DeployedMigration');
        const factoryBuilder5 = await FactoryBuilder5.deploy();
        return factoryBuilder5.deployed();
    });
    verify.setArgs(factoryBuilder5.address);

    const builders = [
        factoryERC721.address,
        factoryERC1155.address,
        factoryCondensed.address,
    ];
    const facade = await ifNotDeployed('Facade', async () => {
        const Facade = await hre.ethers.getContractFactory('Facade');
        const facade = await Facade.deploy(
            gmr.address, builders,
        );
        return facade.deployed();
    });
    verify.setArgs(facade.address, gmr.address, builders);

    const address721 = await ifNotDeployed('CustomERC721', async () => {
        const receipt721 = await (await facade.create721('test721')).wait();
        return {address: deriveAddress(receipt721)};
    });
    verify.setArgs(address721.address, gmr.address, 'test721');

    const address1155 = await ifNotDeployed('CustomERC1155', async () => {
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

    const customResolver = await ifNotDeployed('CustomResolver', async () => {
        const CustomResolver = await hre.ethers.getContractFactory('CustomResolver');
        const customResolver = await CustomResolver.deploy();
        return customResolver.deployed();
    });
    verify.setArgs(customResolver.address);

    const printable = await ifNotDeployed('Printable', async () => {
        const Printable = await hre.ethers.getContractFactory('Printable');
        const printable = await Printable.deploy();
        return printable.deployed();
    });
    verify.setArgs(printable.address);

    verify.print();
    fs.writeFileSync(
        `./scripts/deployed.json`,
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
