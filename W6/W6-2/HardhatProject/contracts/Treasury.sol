// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Treasury {
    // 金库管理员
    address public _admin;

    // 部署时发送ETH存进金库合约
    constructor(address admin_) payable {
        _admin = admin_;
    }

    // 管理员取钱
    function withdraw(uint amount_) payable external {
        require(msg.sender == _admin, "only admin can do this");
        require(amount_ <= address(this).balance, "invaild amount");

        (bool success,) = msg.sender.call{value:amount_}(new bytes(0));
        require(success, 'transfer ETH fail');
    }

}