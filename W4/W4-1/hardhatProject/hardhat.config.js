require("@nomiclabs/hardhat-waffle");
require('hardhat-abi-exporter');

task("accounts", "Prints the list of accounts", async () => {
    const accounts = await ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});
// clarify attend crop moon distance decade boring soldier guide rich apology disagree
const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();
//账号秘钥 .trim()去掉前后空格，StringBuffer转换成String类型时，没有trim会导致意想不到的结果
const privateKey = fs.readFileSync(".secret").toString().trim();
const ropstenId = "befe5a5a616e487c9b61bffa11491acc";

module.exports = {
    defaultNetwork: "dev",
    solidity: {
        compilers: [
            {
                version: "0.8.0",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200
                    }
                }
            },
            {
                version: "0.5.0",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200
                    }
                }
            },
            {
                version: "0.8.1",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200
                    }
                }
            },
            {
                version: "0.6.2",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 999999
                    }
                }
            },
            {
                version: "0.6.12",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 5000
                    }
                }
            }
        ],
    },
    // 部署网络
    networks: {
        dev: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
        },
        ropsten:{
            url:`https://ropsten.infura.io/v3/${ropstenId}`,
            accounts:[privateKey],
            chainId: 3
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
    paths: {
        // 合约来源
        sources: "./contracts",
        // 测试文件
        tests: "./test",
        // 缓存目录
        cache: "./cache",
        // 编译目录
        artifacts: "./artifacts"
    },
    mocha: {
        timeout: 20000
    }
};