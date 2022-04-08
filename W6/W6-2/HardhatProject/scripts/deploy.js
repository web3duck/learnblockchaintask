const hre = require("hardhat");
const { ethers, network } = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

async function main() {
    const [owner, second, third, fourth, fifth] = await ethers.getSigners();

    let amount10 = ethers.utils.parseUnits("10", 18);
    let amount100 = ethers.utils.parseUnits("100", 18);
    const ownersArr = [owner.address, second.address, third.address, fourth.address, fifth.address];   // owners数组
    // 先部署Gov
    const Gov = await hre.ethers.getContractFactory("Gov");
    const gov = await Gov.connect(owner).deploy(ownersArr, 3);    // 必须5个owner中的3个投票赞成，才能通过
    await gov.deployed();
    console.log("gov deployed to:", gov.address);

    // 再部署Treasury
    const Treasury = await hre.ethers.getContractFactory("Treasury");
    const treasury = await Treasury.connect(owner).deploy(gov.address,{value:amount100});    // 部署时设置admin，并存100个ETH进去
    await treasury.deployed();
    console.log("treasury deployed to:", treasury.address);

    // 发起取钱提案
    console.log("发起提案，从金库取10个ETH");
    const data = ethers.utils.defaultAbiCoder.encode(['string'],["hello"]);
    const tx1 = await gov.submitTransaction(treasury.address, amount10, data);    // 0号提案，从金库取10个ETH
    await tx1.wait();
    // second投票
    const gov_second = await gov.connect(second);
    const tx2 = await gov_second.confirmTransaction(0);     // 赞成第0号提案
    console.log("second赞成");
    // third投票
    const gov_third = await gov.connect(third);
    const tx3 = await gov_third.confirmTransaction(0);      // 赞成第0号提案
    console.log("third赞成");
    // fourth投票
    const gov_fourth = await gov.connect(fourth);
    const tx4 = await gov_fourth.confirmTransaction(0);     // 赞成第0号提案
    console.log("fourth赞成");
    // fifth投票
    const gov_fifth = await gov.connect(fifth);
    console.log("fifth反对");
    // do nothing,不赞成

    // 执行取钱提案
    console.log("提案执行");
    const tx_withdraw = await gov.executeTransaction(0);
    await tx_withdraw.wait();

    // 查看余额
    const balance = await gov.getBalance();
    console.log("gov's balance is: ", ethers.utils.formatUnits(balance, 18));
    
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });