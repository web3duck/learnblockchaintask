const hre = require("hardhat");
const { ethers, network } = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

async function main() {
    const [owner, second] = await ethers.getSigners();

    let amount100W = ethers.utils.parseUnits("1000000", 18);
    let amount1000W = ethers.utils.parseUnits("10000000", 18);
    // 部署dogToken 1000W
    const Token = await hre.ethers.getContractFactory("ERC20Token");
    const dogToken = await Token.connect(owner).deploy("dogToken", "DOG", amount1000W);    // DOG会全部发送到owner
    await dogToken.deployed();
    console.log("dogToken deployed to:", dogToken.address);
    const totalSupply = await dogToken.balanceOf(owner.address);
    console.log("dogToken's totalSupply is: ", ethers.utils.formatUnits(totalSupply, 18));

    await writeAddr(dogToken.address, "dogToken", network.name)


    // 部署catToken 1000W
    const catToken = await Token.connect(owner).deploy("catToken", "CAT", amount1000W);    // CAT会全部发送到owner
    await catToken.deployed();
    console.log("catToken deployed to:", catToken.address);
    const cat_totalSupply = await catToken.balanceOf(owner.address);
    console.log("catToken's totalSupply is: ", ethers.utils.formatUnits(cat_totalSupply, 18));

    await writeAddr(catToken.address, "catToken", network.name)

}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });