const hre = require('hardhat');
const { GMRAddr } = require("./utils");

async function main () {
    const BuilderERC721 = await hre.ethers.getContractFactory('BuilderERC721');
    const builderERC721 = await BuilderERC721.deploy(GMRAddr);
    await builderERC721.deployed();

    // 0xfC5D067Afc9C243234fFdA18f50cc190Fa959416
    console.log('BuilderERC721 deployed to:', builderERC721.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
