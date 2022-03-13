// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721 {

    constructor() ERC721("MyNFT", "abcdNFT") {

    }

    // 增发NFT
    function createNFT(address _to, uint _tokenId) public returns(uint){

        _mint(_to, _tokenId);
        return _tokenId;
    }
}