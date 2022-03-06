const hre = require("hardhat");

async function main() {
    //部署Teacher
    const teacherFac = await hre.ethers.getContractFactory("Teacher");
    const teacher = await teacherFac.deploy();
    await teacher.deployed();
    console.log("teacher deployed to:", teacher.address);

    //再部署Score
    const scoreFac = await hre.ethers.getContractFactory("Score");
    const score = await scoreFac.deploy();
    await score.deployed();
    console.log("score deployed to:", score.address);
}




main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
