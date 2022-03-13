const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

async function main() {
  // await hre.run('compile');

  const MyERC20Token = await hre.ethers.getContractFactory("ABCToken");
  const myERC20Token = await MyERC20Token.deploy();

  await myERC20Token.deployed();

  console.log("ABCToken deployed to:", myERC20Token.address);
  await writeAddr(myERC20Token.address, "ABCToken", network.name)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
