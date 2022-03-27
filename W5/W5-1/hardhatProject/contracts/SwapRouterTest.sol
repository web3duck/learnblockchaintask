//SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;
pragma abicoder v2;

import './library/TransferHelper.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
// import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

contract SwapRouterTest {
    // address public constant swapRouter = 0xE592427A0AEce92De3Edee1F18E0157C05861564; 
    uint24 public constant poolFee = 3000;   
    address public swapRouter;

    constructor(address _swapRouter ){
        swapRouter = _swapRouter;
    }

    function swapExactInputSingle(address _tokenIn, address _tokenOut, uint256 _amountIn) public returns (uint256 amountOut) {
        // msg.sender must approve this contract
        TransferHelper.safeTransferFrom(_tokenIn, msg.sender, address(this), _amountIn);
        // Approve the router
        TransferHelper.safeApprove(_tokenIn, address(swapRouter), _amountIn);

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: _tokenIn,
                tokenOut: _tokenOut,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: _amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = ISwapRouter(swapRouter).exactInputSingle(params);
    } 
}

