//SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;
pragma abicoder v2;

import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import '@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import './library/TransferHelper.sol';
import './interfaces/IERC20.sol';


contract FlashSwap is IUniswapV2Callee{
    // using SafeERC20 for IERC20;
    address immutable factory;
    address tokenA;
    address tokenB;
    // v3的SwapRouter地址
    address public constant swapRouter = 0xE592427A0AEce92De3Edee1F18E0157C05861564;      
    // set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    constructor(address _factory, address _tokenA, address _tokenB) public {
        factory = _factory;
        tokenA = _tokenA;
        tokenB = _tokenB;
    }
    // 回调
    function uniswapV2Call(address sender, uint amount0, uint amount1, bytes calldata data) external override {
        (string memory str) = abi.decode(data, (string));
        // console.log("data : ", str);     // hello

        address[] memory path = new address[](2);
        uint amountTokenA;
        uint amountTokenB;
        {
            address token0 = IUniswapV2Pair(msg.sender).token0();
            address token1 = IUniswapV2Pair(msg.sender).token1();
            require(msg.sender == UniswapV2Library.pairFor(factory, token0, token1), "msg.sender is not V2 Pair"); 
            assert(amount0 == 0 || amount1 == 0);       // 只能借出一种资产
            // 确认借出的token数
            // uint token0_Amount = IERC20(token0).balanceOf(address(this));
            // uint token1_Amount = IERC20(token1).balanceOf(address(this));
            // require(token0_Amount == amount0 && token1_Amount == amount1, "the balanceOf token is error");

            path[0] = amount0 == 0 ? token0 : token1;
            path[1] = amount0 == 0 ? token1 : token0;
            amountTokenA = token0 == tokenA ? amount0 : amount1;
            amountTokenB = token0 == tokenA ? amount1 : amount0;
        }


        if(amountTokenA > 0){       // 借 tokenA 还 tokenB
            uint tokenB_Required = UniswapV2Library.getAmountsIn(factory, amountTokenA, path)[0];
            // 在V3中将tokenA兑换成tokenB
            uint amountOut = swapExactInputSingle(tokenA, tokenB, amountTokenA);
            require(amountOut > tokenB_Required, "No profit,stop!");
            // 将tokenB还给V2 pair
            require(IERC20(tokenB).transfer(msg.sender, tokenB_Required), "pay back fail");
            // 赚的利润发送给sender
            require(IERC20(tokenB).transfer(sender, IERC20(tokenB).balanceOf(address(this))), "send the profit fail");
        }

        if(amountTokenB > 0) {      // 借 tokenB 还 tokenA
            uint tokenA_Required = UniswapV2Library.getAmountsIn(factory, amountTokenB, path)[0];
            // 在V3中将tokenB兑换成tokenA
            uint amountOut = swapExactInputSingle(tokenB, tokenA, amountTokenB);
            require(amountOut > tokenA_Required, "No profit,stop!");

            require(IERC20(tokenA).transfer(msg.sender, tokenA_Required), "pay back fail");
            // 赚的利润发送给sender
            require(IERC20(tokenA).transfer(sender, IERC20(tokenA).balanceOf(address(this))), "send the profit");
        }       

    }

    // 使用V3的swap
    function swapExactInputSingle(address _tokenIn, address _tokenOut, uint256 _amountIn) internal returns (uint256 amountOut) {
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
