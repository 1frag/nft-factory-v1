const hre = require('hardhat');
const { GMRAddr } = require("./utils");

async function main () {
    const FactoryERC721 = await hre.ethers.getContractFactory('FactoryERC721');
    const factoryERC721 = await FactoryERC721.deploy(GMRAddr);
    await factoryERC721.deployed();

    // 0xfC5D067Afc9C243234fFdA18f50cc190Fa959416
    console.log('FactoryERC721 deployed to:', factoryERC721.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
