const { ethers, network } = require("hardhat");
const ERC721Addr = require(`../deployments/${network.name}/MyNFT.json`)

async function main() {
    let [owner, second] = await ethers.getSigners();
    let myNFT = await ethers.getContractAt("MyNFT", ERC721Addr.address, owner);

    let filter1 = myNFT.filters.Transfer()

    let filter2 = {
        address: ERC721Addr.address,
        topics: [
            ethers.utils.id("Transfer(address,address,uint256)")
        ]
    }
    // 在线监听事件
    ethers.provider.on(filter2, (event) => {

        console.log(event)
        parseTransferEvent(event);
    })
}
// 解析
async function parseTransferEvent(event) {
  
    const TransferEvent = new ethers.utils.Interface(["event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"]);
    let decodedData = TransferEvent.parseLog(event);
    console.log("from:" + decodedData.args.from);
    console.log("to:" + decodedData.args.to);
    console.log("tokenId:" + decodedData.args.tokenId.toString());
    console.log("block_no:" + event.blockNumber);
    console.log("txHash:" + event.transactionHash);
}

main()
