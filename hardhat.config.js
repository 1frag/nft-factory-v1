require('dotenv').config();
require("@nomiclabs/hardhat-waffle");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY;

module.exports = {
    solidity: "0.8.15",
    networks: {
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
            accounts: [`0x${DEPLOYER_PRIVATE_KEY}`]
        },
        goerli: {
            url: `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
            accounts: [`0x${DEPLOYER_PRIVATE_KEY}`]
        },
        localhost: {
            url: `http://127.0.0.1:8545/`,
            accounts: [`0x${TEST_PRIVATE_KEY}`]
        },
    },
};
