const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

async function main() {
  // await hre.run('compile');

  // 部署Voult合约
  const MyVault = await hre.ethers.getContractFactory("Vault");  
  const myVault = await MyVault.deploy();   
  await myVault.deployed();

  console.log("myVault deployed to: ", myVault.address);
  await writeAddr(myVault.address, "Vault", network.name)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
