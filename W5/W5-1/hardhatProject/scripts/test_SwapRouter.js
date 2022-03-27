const hre = require("hardhat");
const { ethers, network } = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

const catToken = require(`../deployments/${network.name}/catToken.json`);
const dogToken = require(`../deployments/${network.name}/dogToken.json`);
const ERC20Token_abi = require(`../deployments/abi/ERC20Token.json`);


async function main() {
    const [owner, second] = await ethers.getSigners();
    let amount100 = ethers.utils.parseUnits("100", 18);
    let amount1W = ethers.utils.parseUnits("10000", 18);
    // Uniswap V3 的 SwapRouter 地址
    const swapRouterAddr = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

    // 部署SwapRouterTest
    let SwapRouterTest = await ethers.getContractFactory("SwapRouterTest");
    let swapRouter = await SwapRouterTest.connect(owner).deploy(swapRouterAddr);
    await swapRouter.deployed();
    console.log("swapRouter's address is : ", swapRouter.address);
    // 
    const catContract = new ethers.Contract(catToken.address, ERC20Token_abi, owner);
    const dogContract = new ethers.Contract(dogToken.address, ERC20Token_abi, owner);

    // 在Uniswap V3上用100个cat兑换dog
    await catContract.approve(swapRouter.address, amount1W);
    const txSwap = await swapRouter.swapExactInputSingle(catToken.address, dogToken.address, amount100);
    await txSwap.wait();

    const dog_amount = await dogContract.balanceOf(swapRouter.address);
    console.log("swap over, the balance of dog token is: ", ethers.utils.formatUnits(dog_amount, 18));
}




main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });