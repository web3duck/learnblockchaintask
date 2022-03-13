const hre = require("hardhat");
const ethers = hre.ethers;
const {expect} = require("chai");

describe("test_ABCToken", function () {
    let wallet0;
    let wallet1;
    let wallet2;
    let myERC20Token;
    beforeEach(async ()=>{      
        // const wallet0 = await ethers.getSigner(0);
        [wallet0, wallet1, wallet2] = await ethers.getSigners();
        // 部署ABCToken
        const MyERC20Token = await ethers.getContractFactory("ABCToken");  
        myERC20Token = await MyERC20Token.connect(wallet0).deploy();   //创建一个部署合约的交易
        await myERC20Token.deployed();      
        //
        console.log("myERC20Token deployed to: ", myERC20Token.address);
        console.log("myERC20Token's owner is: ", await myERC20Token.owner());   // Token合约的owner是 wallet0

        // 向 wallet1，wallet2 里增发ABC
        const depositTx1 = await myERC20Token.deposite(wallet1.address, 10000);
        const depositTx2 = await myERC20Token.deposite(wallet2.address, 20000);
        await depositTx1.wait();
        await depositTx2.wait();
        
        expect(await myERC20Token.balanceOf(wallet1.address)).to.equal(10000);    // wallet1里应该有10000
        expect(await myERC20Token.balanceOf(wallet2.address)).to.equal(20000);    // wallet2 有20000
        expect(await myERC20Token.totalSupply()).to.equal(30000);                 // 总量应该有30000
    })

    it("transfer1", async ()=>{
        
        let myNew = await myERC20Token.connect(wallet1);
        // wallet1 向 wallet0 转账 8000 
        await myNew.transfer(wallet0.address, 8000);
        // wallet0 余额应该为8000，wallet1 余额应为2000
        expect(await myERC20Token.balanceOf(wallet0.address)).to.equal(8000);
        expect(await myERC20Token.balanceOf(wallet1.address)).to.equal(2000);

        // 创建一个新的连接实例，连接wallet2
        let myNew2 = await myERC20Token.connect(wallet2);
        // wallet2 向 wallet0 转账 10000
        await myNew2.transfer(wallet0.address, 10000);
        // wallet0 余额应为18000，wallet2 余额应为10000
        expect(await myERC20Token.balanceOf(wallet0.address)).to.equal(18000);
        expect(await myERC20Token.balanceOf(wallet2.address)).to.equal(10000);
    })

});
