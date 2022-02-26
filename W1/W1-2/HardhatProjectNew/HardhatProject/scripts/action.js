const{ethers,network} = require("hardhat");
// const Addr = require{""}
counterAddr = "0x0165878A594ca255338adfa4d48449f69242Eb8F";

async function main() {
    let [owner] = await ethers.getSigners();

    // let counter = await ethers.getContractAt("Counter", Addr.address, owner);
    let counter = await ethers.getContractAt("Counter", counterAddr, owner);
    //
    await counter.count();

    let newValue = await counter.counter();
    console.log("newValue:"+newValue)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });