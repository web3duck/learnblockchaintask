
const hre = require("hardhat");

async function main() {
  const OptToken_1155 = await hre.ethers.getContractFactory("OptToken_1155");
  const optToken_1155 = await OptToken_1155.deploy();

  await optToken_1155s.deployed();

  console.log("optToken_1155 deployed to:", optToken_1155.address);
}






main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
