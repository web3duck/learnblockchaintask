const hre = require("hardhat");
const { ethers, network } = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

const catToken = require(`../deployments/${network.name}/catToken.json`);
const dogToken = require(`../deployments/${network.name}/dogToken.json`);

const factoryAddr_V2 ="0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";     // v2的factory地址

async function main() {
    const [owner, second] = await ethers.getSigners();

    // 部署FlashSwap
    let FlashSwap = await ethers.getContractFactory("FlashSwap");
    let flashSwap = await FlashSwap.connect(owner).deploy(factoryAddr_V2, catToken.address, dogToken.address);
    await flashSwap.deployed();
    console.log("flashSwap's address is : ", flashSwap.address);
    await writeAddr(flashSwap.address, "FlashSwap", network.name)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });