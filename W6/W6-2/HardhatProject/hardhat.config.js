require("@nomiclabs/hardhat-waffle");

task("accounts", "Prints the list of accounts", async () => {
    const accounts = await ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

const fs = require('fs');
//账号秘钥 .trim()去掉前后空格，StringBuffer转换成String类型时，没有trim会导致意想不到的结果
const mnemonic = fs.readFileSync(".secretMnemonic").toString().trim();
// const privateKey = fs.readFileSync(".secretPrivateKey").toString().trim();
const keys = "befe5a5a616e487c9b61bffa11491acc";

module.exports = {
    // solidity配置
    solidity: {
        compilers: [
            {
                version: "0.8.3",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 5000
                    }
                }
            },
            // {
            //     version: "0.8.0",
            //     settings: {
            //         optimizer: {
            //             enabled: true,
            //             runs: 5000
            //         }
            //     }
            // },
            // {
            //     version: "0.5.0",
            //     settings: {
            //         optimizer: {
            //             enabled: true,
            //             runs: 5000
            //         }
            //     }
            // },
            // {
            //     version: "0.6.6",
            //     settings: {
            //         optimizer: {
            //             enabled: true,
            //             runs: 5000
            //         }
            //     }
            // },
            // {
            //     version: "0.7.5",
            //     settings: {
            //         optimizer: {
            //             enabled: true,
            //             runs: 5000
            //         }
            //     }
            // }
        ],
    },
    // 网络配置
    defaultNetwork: "dev",
    networks: {
        hardhat: {
            // mining: {
            //     auto: false,
            //     interval: 1000       设置每1秒出一个块
            //   }
        },
        dev: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
        },
        ropsten:{
            url:`https://ropsten.infura.io/v3/${keys}`,
            // accounts:[privateKey],
            accounts: {
                mnemonic: mnemonic,
            },
            chainId: 3
        },
        kovan:{
            url:`https://kovan.infura.io/v3/${keys}`,
            accounts: {
                mnemonic: mnemonic,
            },
            chainId: 42
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