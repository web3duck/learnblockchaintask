require("@nomiclabs/hardhat-waffle");
require('hardhat-abi-exporter');

// npm install hardhat-abi-exporter

task("accounts", "Prints the list of accounts", async () => {
    const accounts = await ethers.getSigners();
  
    for (const account of accounts) {
      console.log(account.address);
      console.log(account.privateKey);
    }
  });

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.8.3",

    networks: {
        dev: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
        }
    },

    abiExporter: {
        path: './deployments/abi',
        clear: true,
        flat: true,
        only: [],
        spacing: 2,
        pretty: true,
      },
};
