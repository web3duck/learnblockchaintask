// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@aave/core-v3/contracts/flashloan/interfaces/IFlashLoanSimpleReceiver.sol";

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";


contract Receiver is FlashLoanSimpleReceiverBase {
    uint24 public constant poolFee = 3000;   
    address public swapRouter;
    address public router;
    address public tokenA;
    address public tokenB;

    constructor(address _addressProvider, address _swapRouter,address _router, address _tokenA, address _tokenB)
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider)){
            swapRouter = _swapRouter;
            tokenA = _tokenA;
            tokenB = _tokenB;
        }

    // 收款并回调
    // 借出的tokenA在 Uniswap V2 中交易兑换 token B，然后在 Uniswap V3 token B 兑换为 token A
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external returns (bool) {
        // 在v2中兑换成tokenB
        uint tokenB_Amount = swapExactTokensForTokens(amount, 0);
        // 在V3中兑换成TokenA
        uint amountOut = swapExactInputSingle(tokenB, tokenA, tokenB_Amount);
        //授权给Pool合约地址所借金额加手续费,还款
        IERC20(asset).approve(ADDRESSES_PROVIDER.getPool(), amountOut + premium);
        return true;
    }
    // v3 swap 
    function swapExactInputSingle(address _tokenIn, address _tokenOut, uint256 _amountIn) public returns (uint256 amountOut) {
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
    // v2 swap
    function swapExactTokensForTokens(uint _amountIn, uint _amountOutMin) returns(uint tokenB_Amount){
        IERC20(TokenA).safeApprove(_router, _amountIn);
        // [TokenA, TokenB]
        address[] memory path = new address[](2);
        path[0] = TokenA;
        path[1] = TokenB;
        uint[] memory amounts;
        amounts = IUniswapV2Router01(router).swapExactTokensForTokens(_amountIn, _amountOutMin, path, address(this), block.timestamp);
        tokenB_Amount = amounts[amounts.length - 1];
    }
    
}