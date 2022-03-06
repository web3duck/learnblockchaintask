// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Score {
    mapping(address => uint8) public students; 
    address public teacherAddr;

    //部署时需传入Teacher合约地址
    constructor(address teacher_Contract_Addr){
        teacherAddr = teacher_Contract_Addr;
    }

    modifier OnlyTeacher() {
        require(teacherAddr == msg.sender, "only teacher can do this");
        _;
    }
    // 添加，修改分数
    function setScore(address addr, uint8 score) external OnlyTeacher {
        require(score <= 100 && score >=0, "score must less than 100.");   //分数小于100
        require(address(0) != addr, "addr is not available");
        students[addr] = score;

        console.log("Operation successful, now score is ", score);
    }
    // 查看分数
    function getScore(address addr) public view returns(uint8){
        return students[addr];
    }
}

