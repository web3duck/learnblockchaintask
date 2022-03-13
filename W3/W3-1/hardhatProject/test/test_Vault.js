const hre = require("hardhat");
const ethers = hre.ethers;
const {expect} = require("chai");


describe("test_Vault", ()=>{
    let wallet0;
    let wallet1;
    let wallet2;
    let myERC20Token;
    let myVault;
    beforeEach(async ()=>{
        [wallet0, wallet1, wallet2] = await ethers.getSigners();
        // 部署ERC20合约
        const MyERC20Token = await ethers.getContractFactory("ABCToken");  
        myERC20Token = await MyERC20Token.connect(wallet0).deploy();   
        await myERC20Token.deployed();      
        console.log("myERC20Token deployed to: ", myERC20Token.address);
        // 部署Voult合约
        const MyVault = await ethers.getContractFactory("Vault");  
        myVault = await MyVault.connect(wallet0).deploy();   
        await myVault.deployed();
        console.log("myVault deployed to: ", myVault.address);
        // 向 wallet1 里增发10000个ABC
        const depositTx1 = await myERC20Token.deposite(wallet1.address, 10000);
        await depositTx1.wait();
    })
    it("approve ande transfer", async ()=>{
        // wallet1 授权给Vault合约8000个ABC
        let w1_ERC20 = await myERC20Token.connect(wallet1);
        console.log("w1_ERC20 address is: ", w1_ERC20.address);
        await w1_ERC20.approve(myVault.address, 8000);
        // wallet1 的ABC币的余额应为 10000
        expect(await myERC20Token.balanceOf(wallet1.address)).to.equal(10000);
        expect(await myERC20Token.allowance(wallet1.address, myVault.address)).to.equal(8000);

        // wallet1 向Vault合约存8000个ABC
        let w1_Vault = await myVault.connect(wallet1);
        console.log("w1_Vault address is: ", w1_Vault.address);
        const txDeposite = await w1_Vault.deposite(myERC20Token.address, 8000);
        await txDeposite.wait();
        
        expect(await myERC20Token.allowance(wallet1.address, myVault.address)).to.equal(0);
        // wallet1 在ABC_ERC20中的余额应该剩2000
        expect(await myERC20Token.balanceOf(wallet1.address)).to.equal(2000);
        // wallet1 在Vault中的余额应该有8000
        expect(await myVault.getBalance(wallet1.address)).to.equal(8000);

        // wallet1 从Vault中取8000个ABC
        const txWithdraw = await w1_Vault.withdraw(myERC20Token.address, 8000);
        await txWithdraw.wait();
        // wallet1 在ABC_ERC20中的余额应该回到10000
        expect(await myERC20Token.balanceOf(wallet1.address)).to.equal(10000);
        // wallet1 在Vault中的余额应该为0
        expect(await myVault.getBalance(wallet1.address)).to.equal(0);
        expect(await myERC20Token.allowance(wallet1.address, myVault.address)).to.equal(0);
    })
})