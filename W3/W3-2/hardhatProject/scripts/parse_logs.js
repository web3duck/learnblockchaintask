const { ethers, network } = require("hardhat");
const mysql = require("mysql");

const ERC721Addr = require("../deployments/dev/MyNFT.json")

async function parseTransferEvent(event) {
    const TransferEvent = new ethers.utils.Interface(["event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"]);
    let decodedData = TransferEvent.parseLog(event);
    console.log("from:" + decodedData.args.from);
    console.log("to:" + decodedData.args.to);
    console.log("tokenId:" + decodedData.args.tokenId.toString());
    console.log("block_no:" + event.blockNumber);
    console.log("txHash:" + event.transactionHash);
    const fromAddr = decodedData.args.from;
    const toAddr  = decodedData.args.to;
    const tokenId = decodedData.args.tokenId.toString();
    const block_no = event.blockNumber;
    const txHash = event.transactionHash;
    // 写入数据库
    insertTransferDB(fromAddr, toAddr, tokenId, txHash, block_no);
    console.log("写入数据库成功");
}

function insertTransferDB(fromAddr, toAddr, tokenId, txHash, block_no){
    // 连接数据库
    const connection = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"root",
        port:"3306",
        database:"eventlogsdb"
    });
    connection.connect();
    //
    const query = "insert into transferlogs (fromAddr,toAddr,tokenId,txHash,block_no,created_at) values (?,?,?,?,?,NOW())";
    const params = [fromAddr, toAddr, tokenId, txHash, block_no];
    connection.query(query, params, function(error){
        if(error) throw error;
    })
    //
    connection.end();
}

async function main() {
    let [owner, second] = await ethers.getSigners();
    let myNFT = await ethers.getContractAt(ERC721Addr.contractName, ERC721Addr.address, owner);

    let filter = myNFT.filters.Transfer()
    filter.fromBlock = 200;
    filter.toBlock = 300;


    // let events = await myerc20.queryFilter(filter);
    let events = await ethers.provider.getLogs(filter);
    for (let i = 0; i < events.length; i++) {
        // console.log(events[i]);
        parseTransferEvent(events[i]);

    }
}

main()