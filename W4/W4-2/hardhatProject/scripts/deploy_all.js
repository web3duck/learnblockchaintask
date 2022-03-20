let { ethers } = require("hardhat");

async function main() {
    let [owner, second] = await ethers.getSigners();
    // 发行TokenA, TokenB, SushiToken 各1000万
    let Token = await ethers.getContractFactory("Token");
    let SushiToken = await ethers.getContractFactory("SushiToken");

    let amount1000W = ethers.utils.parseUnits("10000000", 18);

    let atoken = await Token.deploy("TokenA", "TokenA", amount1000W);
    let btoken = await Token.deploy("TokenB", "TokenB", amount1000W);
    let sushiToken = await SushiToken.deploy();

    await atoken.deployed();
    console.log("TokenA's address is : " + atoken.address);
    await btoken.deployed();
    console.log("TokenB's address is : " + btoken.address);
    await sushiToken.deployed();
    console.log("SushiToken's address is : ", sushiToken.address);

    // 部署MasterChef
    let MasterChef = await ethers.getContractFactory("MasterChef");
    let masterChef = await MasterChef.deploy(sushiToken.address, owner.address, 1000, 100, 1000);
    await masterChef.deployed();
    console.log("MatserChef's address is : ", masterChef.address);
    // mint 
    await sushiToken.mint(sushiToken.address, amount1000W);
    await sushiToken.mint(masterChef.address, amount1000W);
    // 建流动性质押池子并拿到池子的pid, 
    // 因为add()被onlyowner修饰，必须由owner创建
    let tx1 = await masterChef.add(100, btoken.address, true);
    await tx1.wait();
    let poolLength = await masterChef.poolLength();            // bigNumber
    let tokenB_pid = poolLength.sub(1).toNumber();             // pid = poolInfo.length -1;

    // 部署MyTokenMarket，因为需要传入参数，所以最后部署
    let MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");
    let routerAddr = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    let wethAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    let market = await MyTokenMarket.deploy(
        atoken.address,
        btoken.address,
        routerAddr,
        wethAddr,
        masterChef.address,
        tokenB_pid
    );
    await market.deployed();
    console.log("MyTokenMarket's address is : " + market.address);
    console.log("");



    // 建池子1：  TokenA & ETH coin
    await atoken.approve(market.address, amount1000W);
    let amount800W = ethers.utils.parseUnits("8000000", 18);
    let amount800 = ethers.utils.parseUnits("800", 18);
    await market.AddLiquidityByToken_ETH(amount800W, { value: amount800 })     // TokenA 800W个，ETH 800个
    console.log("TokenA & ETH 池子建立完成");

    // 建池子2：  TokenA & TokenB
    await btoken.approve(market.address, amount1000W);
    let amount200W = ethers.utils.parseUnits("2000000", 18);
    await market.AddLiquidityByTokenA_TokenB(amount200W, amount1000W)        // tokenA 200W个, tokenB 1000W个
    console.log("TokenA & TokenB 池子建立完成");
    console.log("");

    // 用1个ETH买TokenA，没有滑点应该能买到10000个TokenA
    let a = await atoken.balanceOf(owner.address);
    let b = await btoken.balanceOf(owner.address);
    console.log("owner现在持有TokenA:" + ethers.utils.formatUnits(a, 18));
    console.log("owner现在持有TokenB:" + ethers.utils.formatUnits(b, 18));
    console.log("");
    // swap
    console.log("拿1个ETH兑换TokenA,没有滑点应该能买到10000个TokenA");
    let amount1 = ethers.utils.parseUnits("1", 18);
    let tx2 = await market.buyTokenA(0, { value: amount1 })
    await tx2.wait();
    tokenAAmount = await atoken.balanceOf(owner.address);
    tokenBAmount = await btoken.balanceOf(owner.address);
    console.log("owner现在持有TokenA: " + ethers.utils.formatUnits(tokenAAmount, 18));
    console.log("owner现在持有TokenB: " + ethers.utils.formatUnits(tokenBAmount, 18));
    console.log("");

    // 用200个TokenA购买TokenB，没有滑点应该买到1000个TokenB
    await atoken.approve(market.address, tokenAAmount);  // atoken的1000W授权已经用完，得重新授权
    console.log("用200个TokenA购买TokenB,没有滑点应该买到1000个TokenB");
    let buyToeknBAmount = ethers.utils.parseUnits("200", 18);
    let tx3 = await market.buyTokenBByTokenA(buyToeknBAmount, 0)
    await tx3.wait();
    let aTokenNum = await atoken.balanceOf(owner.address);
    let bTokenNum = await btoken.balanceOf(owner.address);
    console.log("owner现在持有TokenA:" + ethers.utils.formatUnits(aTokenNum, 18));
    // 因为兑换成TokenB后，直接存进MasterChef中作为LP质押挖矿了，所以没取回来前，owner的TokenB余额都为0.
    console.log("owner现在持有TokenB:" + ethers.utils.formatUnits(bTokenNum, 18));
    // 查看存入masterChef中的TokenB
    let tokenB_Amount = await btoken.balanceOf(masterChef.address);
    console.log("存入pool中的TokenB数量为: ", ethers.utils.formatUnits(tokenB_Amount, 18));
    console.log(" ");
    
    // 从masterChef中提取TokenB
    let txWithdraw = await market.withdraw();
    await txWithdraw.wait();
    let bTokenNum2 = await btoken.balanceOf(market.address);
    console.log("owner现在持有TokenB:" + ethers.utils.formatUnits(bTokenNum2, 18));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });