const hre = require("hardhat");
const { ethers, network } = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

const catToken = require(`../deployments/${network.name}/catToken.json`);
const dogToken = require(`../deployments/${network.name}/dogToken.json`);
const flashSwap = require(`../deployments/${network.name}/FlashSwap.json`);

const ERC20Token_abi = require(`../deployments/abi/ERC20Token.json`);
const pair_abi = require(`../deployments/abi/UniswapV2Pair.json`);
const Factory_abi = require(`../deployments/abi/UniswapV2Factory.json`);
const SwapRouter_abi = require(`../deployments/abi/SwapRouter.json`);

const factoryAddr_V2 ="0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";     // v2的factory地址


async function main() {
    const [owner, second] = await ethers.getSigners();
    let amount100 = ethers.utils.parseUnits("100", 18);
    let amount1000 = ethers.utils.parseUnits("1000", 18);
    let amount1W = ethers.utils.parseUnits("10000", 18);

    const factory = new ethers.Contract(factoryAddr_V2, Factory_abi, second);
    const pairAddr = await factory.getPair(catToken.address, dogToken.address);
    console.log("pairAddr: ", pairAddr);
    const pair = new ethers.Contract(pairAddr, pair_abi, second);
    
    const catContract = new ethers.Contract(catToken.address, ERC20Token_abi, owner);
    const dogContract = new ethers.Contract(dogToken.address, ERC20Token_abi, owner);

    const a = await catContract.balanceOf(pairAddr);
    const b = await dogContract.balanceOf(pairAddr);
    console.log("a: ", ethers.utils.formatUnits(a, 18));
    console.log("b: ", ethers.utils.formatUnits(b, 18));

    // const tx1 = await catContract.transfer(flashSwap.address, amount1W);
    // await tx1.wait();
    // const tx2 = await dogContract.transfer(flashSwap.address, amount1W);
    // await tx2.wait();
    // const e = await catContract.balanceOf(flashSwap.address);
    // const f = await dogContract.balanceOf(flashSwap.address);
    // console.log("e: ", ethers.utils.formatUnits(e, 18));
    // console.log("f: ", ethers.utils.formatUnits(f, 18));

    // v2池子中dog和cat是 1：1， v3池子中dog和cat是 2：1
    // 用second账户 从V2上借 100个 TokenA做闪电贷
    const data = ethers.utils.defaultAbiCoder.encode(['string'],["hello"]);
    // const txSwap = await pair.swap(amount100, 0, flashSwap.address, data);    
    const txSwap = await pair.swap(0, amount100, flashSwap.address, data);
    await txSwap.wait();

    // 查看second账户的收益
    const c = await dogContract.balanceOf(second.address);
    console.log("the balance of Dog in second: ", ethers.utils.formatUnits(c, 18));
    const d = await catContract.balanceOf(second.address);
    console.log("the balance of Cat in second: ", ethers.utils.formatUnits(d, 18));
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });