// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bank {
    address public owner;
    mapping(address => uint) private balances;

    constructor() {
        owner = msg.sender;
    }
    
    function deposit() public payable {     
        balances[msg.sender] += msg.value;
    }
    // call转账时调用，MetaMask转账时调用
    receive() external payable {            
        balances[msg.sender] += msg.value;
    }
    // 管理员取出bank中全部以太
    function withdraw(address to) public payable {      
        require(owner == msg.sender, "only owner can do this");
        require(to != address(0), "must be userful address");
        payable(to).transfer(address(this).balance);
    }
    // 用户取出他们的存款
    function withdrawForUser(uint amount) public payable {     
        require(amount > 0, "amount must > 0 ");
        require(balances[msg.sender] >= amount, "your balance is not enough.");
        // 更新余额
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
    // 查银行总账
    function getBalance() public view returns(uint){     
        return address(this).balance;
    }
    // 查用户存款
    function getBalanceForUser(address who) public view returns(uint){     
        return balances[who];
    }
}


contract UserTest{
    constructor() payable {}
    receive() payable external {}

    function deposit(address bankAddr) public {
        (bool success,  ) = bankAddr.call{value: 1 ether}(new bytes(0));
        require(success, "transfer failed");
    }
    
    function getBalance() public view returns(uint){     
        return address(this).balance;
    }
}

