const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

async function main() {
  // await hre.run('compile');

  // 部署
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");  
  const myNFT = await MyNFT.deploy();   
  await myNFT.deployed();

  console.log("myNFT deployed to: ", myNFT.address);
  await writeAddr(myNFT.address, "MyNFT", network.name)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
