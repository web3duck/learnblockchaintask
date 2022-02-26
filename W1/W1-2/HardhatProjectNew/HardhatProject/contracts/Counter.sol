//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Counter{
    uint public counter;
    constructor(){
        console.log("deploying now!");
        counter = 0;
    }

    function count() public{
        console.log("now, counter is:", counter);
        counter += 1;
    }

    function add(uint x) public{
        console.log("now, counter is:", counter);
        counter += x;
    }
}