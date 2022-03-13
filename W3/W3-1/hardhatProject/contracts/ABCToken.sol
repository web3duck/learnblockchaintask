// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ABCToken is ERC20 {
    address immutable public owner;    

    constructor() ERC20("ABCToken", "ABC") {
        owner = msg.sender;
    }

    // 增发ABC
    function deposite(address _to, uint _amount) external {
        // require(owner == msg.sender, "sorry! only admin can do this.");

        _mint(_to, _amount);
    }
}