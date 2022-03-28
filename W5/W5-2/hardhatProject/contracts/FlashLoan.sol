// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@aave/core-v3/contracts/flashloan/interfaces/IFlashLoanSimpleReceiver.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract FlashLoan is FlashLoanSimpleReceiverBase {
    address public receiver;
    
    constructor(address _addressProvider, address _receiver)
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider)){
            receiver = _receiver
        }
    // loan
    function loanSimple(address _asset, uint256 _amount) public {
        IPool pool = IPool(ADDRESSES_PROVIDER.getPool());
        pool.flashLoanSimple(receiver, _asset, _amount, new bytes(0), 0);
    }
}