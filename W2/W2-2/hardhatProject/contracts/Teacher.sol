// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IScore {
    function setScore(address, uint8) external ;
}

//先部署Teacher
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