// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract Vault {
    mapping (address=>uint) public balances;

    // 存入ERC20代币
    function deposite(address erc20Addr, uint amount) external {
        // 进行授权转账
        bool result = IERC20(erc20Addr).transferFrom(msg.sender, address(this), amount);	
        require(result, "transferFrom is failed");

        balances[msg.sender] += amount;
    }
    // 取出ERC20代币
    function withdraw(address erc20Addr, uint amount) external {
        require(balances[msg.sender] >= amount, "balances is not enough");

        balances[msg.sender] -= amount;
        bool result = IERC20(erc20Addr).transfer(msg.sender, amount);
        require(result, "transfer is failed");
    }

    function getBalance(address addr) public view returns(uint){
        return balances[addr];
    }
}