require("@nomiclabs/hardhat-waffle");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.11",

  networks: {
    dev: {
        url: "http://127.0.0.1:8545",
        chainId: 31337,
    }
}
};
