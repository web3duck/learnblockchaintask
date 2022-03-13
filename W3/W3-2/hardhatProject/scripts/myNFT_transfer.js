const hre = require("hardhat");

const ERC721Abi = require("../deployments/abi/MyNFT.json")
const ERC721Addr = require(`../deployments/${network.name}/MyNFT.json`)

async function main() {

    let [owner, second] = await ethers.getSigners();
    let myNFT = await ethers.getContractAt(ERC721Addr.contractName, ERC721Addr.address, owner);
    // 增发
    // await myNFT.createNFT(owner.address, 1001);
    await myNFT.transferFrom(owner.address, second.address, 1001);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });