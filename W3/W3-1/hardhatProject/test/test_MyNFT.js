const hre = require("hardhat");
const ethers = hre.ethers;
const {expect} = require("chai");


describe("test_NFT", ()=>{
    let wallet0;
    let wallet1;
    let wallet2;
    let myNFT;
    beforeEach(async ()=>{
        [wallet0, wallet1, wallet2] = await ethers.getSigners();
        // 部署
        const MyNFT = await hre.ethers.getContractFactory("MyNFT");  
        myNFT = await MyNFT.deploy();   
        await myNFT.deployed();
        console.log("myNFT deployed to: ", myNFT.address);
    })
    it("mint ande transfer NFT", async ()=>{
        // 增发NFT
        await myNFT.createNFT(wallet1.address, 1000);
        await myNFT.createNFT(wallet1.address, 2000);
        
        expect(await myNFT.balanceOf(wallet1.address)).to.equal(2);
        expect(await myNFT.ownerOf(1000)).to.equal(wallet1.address);
        expect(await myNFT.ownerOf(2000)).to.equal(wallet1.address);

        // 授权  账户1向账户0授权1000号NFT
        let myNewNFT = await myNFT.connect(wallet1);        // 授权有权限控制，这里用wallet1创建新的连接实例
        const txApprove = await myNewNFT.approve(wallet0.address, 1000);
        await txApprove.wait();
        
        expect(await myNewNFT.getApproved(1000)).to.equal(wallet0.address);
        
        // 交易NFT
        const txTransfer = await myNewNFT.transferFrom(wallet1.address, wallet2.address, 1000);
        await txTransfer.wait();
        
        expect(await myNewNFT.balanceOf(wallet1.address)).to.equal(1);
        expect(await myNewNFT.ownerOf(1000)).to.equal(wallet2.address);
        // NFT交易后应该没有授权
        const zeroAddr = ethers.constants.AddressZero;
        expect(await myNFT.getApproved(1000)).to.equal(zeroAddr);
    })
})