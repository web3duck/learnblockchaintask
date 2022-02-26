const { artifacts, network } = require("hardhat");
const hre = require("hardhat");

async function main() {
  await hre.run('compile');

  const Counter = await hre.ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();

  await counter.deployed();
  console.log("counter deployed to:", counter.address);

//   let Artifact = await artifacts.readArtifact("Counter");
//   await writeAbiAddr(Artifact, counter.address, "Counter", network.name);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
