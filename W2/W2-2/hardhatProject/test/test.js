const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Score", function () {
  it("测试", async function () {
        //部署Teacher
        const teacherFac = await hre.ethers.getContractFactory("Teacher");
        const teacher = await teacherFac.deploy();
        await teacher.deployed();
        console.log("teacher deployed to:", teacher.address);
    
        //再部署Score,需要传入teacher合约的地址
        const scoreFac = await hre.ethers.getContractFactory("Score");
        const score = await scoreFac.deploy(teacher.address);
        await score.deployed();
        console.log("score deployed to:", score.address);

        let student1 = ethers.Wallet.createRandom().address;
        let student2 = ethers.Wallet.createRandom().address;

        // 测试接口调用
        const setScoreTx1 = await teacher.setScoreByInterface(score.address, student1, 100);
        // call调用
        const setScoreTx2 = await teacher.setScoreBycall(score.address, student2, 99);
        await setScoreTx1.wait();
        await setScoreTx2.wait();
        expect(await score.getScore(student1)).to.equal(100);
        expect(await score.getScore(student2)).to.equal(99);
        
  });
});
