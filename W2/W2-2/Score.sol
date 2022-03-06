// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
    }
    // 查看分数
    function getScore(address addr) public view returns(uint8){
        return students[addr];
    }
}

interface IScore {
    function setScore(address, uint8) external ;
}

//先部署Teacher，因为部署Score时需要传入Teacher合约的地址
contract Teacher {
    //老师打分
    function setScoreByInterface(address score_Contract_Addr, address student, uint8 score) public {
        IScore(score_Contract_Addr).setScore(student, score);
    }

    function setScoreBycall(address score_Contract_Addr, address student, uint8 score) public {
        (bool success, ) = score_Contract_Addr.call(abi.encodeWithSignature("setScore(address,uint8)", student, score));
        require(success, "transaction failed");
    }
}