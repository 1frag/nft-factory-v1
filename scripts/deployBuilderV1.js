const hre = require('hardhat');
const { GMRAddr } = require("./utils");

async function main () {
    const BuilderV1 = await hre.ethers.getContractFactory('BuilderV1');
    const builderV1 = await BuilderV1.deploy(GMRAddr);
    await builderV1.deployed();

    // 0xfC5D067Afc9C243234fFdA18f50cc190Fa959416
    console.log('BuilderV1 deployed to:', builderV1.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
