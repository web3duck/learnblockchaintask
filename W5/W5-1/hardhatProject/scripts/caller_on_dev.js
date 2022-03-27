const hre = require("hardhat");
const { ethers, network } = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

const catToken = require(`../deployments/${network.name}/catToken.json`)
const dogToken = require(`../deployments/${network.name}/dogToken.json`)
const ERC20Token_abi = require(`../deployments/abi/ERC20Token.json`)
const Factory_abi = require(`../deployments/abi/UniswapV2Factory.json`)
const pair_abi = require(`../deployments/abi/UniswapV2Pair.json`)

async function main() {
    const [owner, second] = await ethers.getSigners();
    let amount100 = ethers.utils.parseUnits("100", 18);
    let amount1W = ethers.utils.parseUnits("10000", 18);
    let amount8W = ethers.utils.parseUnits("80000", 18);
    let amount10W = ethers.utils.parseUnits("100000", 18);
    let amount100W = ethers.utils.parseUnits("1000000", 18);
    let amount1000W = ethers.utils.parseUnits("10000000", 18);

    const factoryAddr ="0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const router01 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";      // dev 上的router01

    // 部署AddLiquidity
    let AddLiquidity = await ethers.getContractFactory("AddLiquidity");
    let addLiquidity = await AddLiquidity.connect(owner).deploy(catToken.address, dogToken.address, router01);
    await addLiquidity.deployed();
    console.log("addLiquidity's address is : ", addLiquidity.address);
    await writeAddr(addLiquidity.address, "AddLiquidity", network.name)
    
    // 先授权给AddLiquidity,再添加流动性
    const catContract = new ethers.Contract(catToken.address, ERC20Token_abi, owner);
    const dogContract = new ethers.Contract(dogToken.address, ERC20Token_abi, owner);
    await catContract.approve(addLiquidity.address, amount10W);
    await dogContract.approve(addLiquidity.address, amount10W);
    const txAddLiquidity = await addLiquidity.AddLiquidityByTokenA_TokenB(amount10W, amount10W);
    await txAddLiquidity.wait();

    // 部署FlashSwap
    let FlashSwap = await ethers.getContractFactory("FlashSwap");
    let flashSwap = await FlashSwap.connect(owner).deploy(factoryAddr, catToken.address, dogToken.address);
    await flashSwap.deployed();
    console.log("flashSwap's address is : ", flashSwap.address);
    await writeAddr(flashSwap.address, "FlashSwap", network.name)
    // 
    await catContract.transfer(flashSwap.address, amount10W);
    await dogContract.transfer(flashSwap.address, amount10W);

    // second 从Uniswap V2借TokenA
    const factory = new ethers.Contract(factoryAddr, Factory_abi, second);
    const pairAddr = await factory.getPair(catToken.address, dogToken.address);
    console.log("pairAddr: ", pairAddr);
    const pair = new ethers.Contract(pairAddr, pair_abi, second);
    // const a = await catContract.balanceOf(pairAddr);
    // const b = await dogContract.balanceOf(pairAddr);
    // console.log("a: ", ethers.utils.formatUnits(a, 18));
    // console.log("b: ", ethers.utils.formatUnits(b, 18));
    const data = ethers.utils.defaultAbiCoder.encode(['string'],["hello"]);
    const txSwap = await pair.swap(amount100, 0, flashSwap.address, data);          // 这里借的量相对于池子不能太大，否则要还的更多
    await txSwap.wait();

    // 查看sender的收益
    const c = await dogContract.balanceOf(second.address);
    console.log("send's profit: ", ethers.utils.formatUnits(c, 18));
    const d = await catContract.balanceOf(second.address);
    console.log("send's profit: ", ethers.utils.formatUnits(d, 18));
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });