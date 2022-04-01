const hre = require("hardhat");
let { ethers } = require("hardhat");

// function sleep(millisecond) {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             resolve()
//         }, millisecond)
//     })
// }
// await sleep(3000);    // 等待3秒后，区块并没有增加

async function main() {
    const [owner, second] = await ethers.getSigners();

    const SushiToken = await hre.ethers.getContractFactory("SushiToken");
    const sushi = await SushiToken.connect(owner).deploy();
    await sushi.deployed();
    console.log("SushiToken deployed to:", sushi.address);

    const MasterChef = await hre.ethers.getContractFactory("MasterChef");
    let amount1000 = ethers.utils.parseUnits("1000", 18);       // 每个区块产生sushi的数量，涉及到token数量的时候，都要转换成大数
    const chef = await MasterChef.connect(owner).deploy(sushi.address, owner.address, amount1000, 0, 0);    // 千万注意，lpSupply是个大数
    await chef.deployed();
    console.log("MasterChef deployed to:", chef.address);

    let amount100W = ethers.utils.parseUnits("1000000", 18);

    const Token = await hre.ethers.getContractFactory("Token");
    const tokenERC20 = await Token.connect(second).deploy("token", "tokenERC20", amount100W);    // 用second部署，token会全部mint到second
    await tokenERC20.deployed();
    console.log("tokenERC20 deployed to:", tokenERC20.address);

    // add pool
    const txAdd = await chef.add(100, tokenERC20.address, true);
    await txAdd.wait();
    const poolLength = await chef.poolLength();
    console.log("add pool success, the poolLength is: ", poolLength.toNumber());

    // deposit 10W Token
    let amount10W = ethers.utils.parseUnits("100000", 18);
    // 换second来质押操作
    const chef_second = await chef.connect(second);
    // 先授权
    await tokenERC20.approve(chef.address, amount10W);
    const txDeposit = await chef_second.deposit(0, amount10W);
    await txDeposit.wait();
    const second_tokenERC20_balance = await tokenERC20.balanceOf(second.address);
    const chef_tokenERC20_balance = await tokenERC20.balanceOf(chef.address);
    console.log("second账户的Token余额: ", ethers.utils.formatUnits(second_tokenERC20_balance, 18));
    console.log("chef账户的Token余额: ", ethers.utils.formatUnits(chef_tokenERC20_balance, 18));

    // 加2个区块，
    const no1 = await chef_second.getBlockNumber();
    console.log("bolckNumber is: ", no1.toString());
    await chef_second.addNum();
    await chef_second.addNum();
    await chef_second.addNum();
    await chef_second.addNum();
    await chef_second.addNum();
    // await sleep(3000);
    const no2 = await chef_second.getBlockNumber();
    console.log("bolckNumber is: ", no2.toString());

    // pendingSushi
    const pendingSushi = await chef_second.pendingSushi(0, second.address);
    console.log("已积累Sushi的收益: ", ethers.utils.formatUnits(pendingSushi, 18));

    // withdraw
    const txWithdraw = await chef_second.withdraw(0, amount10W);
    await txWithdraw.wait();
    const second_sushi_balance = await sushi.balanceOf(second.address);
    const second_tokenERC20_balance1 = await tokenERC20.balanceOf(second.address);
    const chef_sushi_balance1 = await sushi.balanceOf(chef.address);
    const devAddr_sushi_balance = await sushi.balanceOf(owner.address);
    console.log("second账户现有sushi余额: ", ethers.utils.formatUnits(second_sushi_balance, 18));
    console.log("second账户现有Token余额: ", ethers.utils.formatUnits(second_tokenERC20_balance1, 18));
    console.log("chef合约上现有sushi余额: ", ethers.utils.formatUnits(chef_sushi_balance1, 18));
    console.log("devAddr上现有sushi余额: ", ethers.utils.formatUnits(devAddr_sushi_balance, 18));


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
