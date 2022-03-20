//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IUniswapV2Router01.sol";
import "./MasterChef.sol";
import "hardhat/console.sol";

contract MyTokenMarket{
    using SafeERC20 for IERC20;

    address public TokenA;
    address public TokenB;
    address public router;
    address public weth;
    MasterChef public chef;
    uint public tokenB_pid;

    // swap得到的TokenB数量
    uint public tokenB_Amount;

    constructor(address _tokenA, address _tokenB, address _router, address _weth, MasterChef _chef, uint _tokenB_pid){
        TokenA = _tokenA;
        TokenB = _tokenB;
        router = _router;
        weth = _weth;
        chef = _chef;
        tokenB_pid = _tokenB_pid;
    }

    // 添加流动性: tokenA & ETH coin
    function AddLiquidityByToken_ETH(uint tokenAmount) external payable returns(uint amountToken, uint amountETH, uint liquidity){
        IERC20(TokenA).safeTransferFrom(msg.sender, address(this), tokenAmount);
        // Market授权给router
        IERC20(TokenA).safeApprove(router, tokenAmount);

        (amountToken, amountETH, liquidity) = IUniswapV2Router01(router).addLiquidityETH{value: msg.value}(
            TokenA, tokenAmount, 0, 0, msg.sender, block.timestamp);
        require(liquidity > 0, "AddLiquidity is Unsuccessful");
        // log
        // console.log("TokenA in pair: ", amountToken);
        // console.log("ETH in pair: ", amountETH);
        // console.log("send LP is: ", liquidity);
    }
    // 添加流动性: tokenA & tokenB
    function AddLiquidityByTokenA_TokenB(uint tokenAAmount, uint tokenBAmount) external payable returns(uint amountA, uint amountB, uint liquidity){
        IERC20(TokenA).safeTransferFrom(msg.sender, address(this), tokenAAmount);
        IERC20(TokenB).safeTransferFrom(msg.sender, address(this), tokenBAmount);
        // MyTokenMarket授权给router
        IERC20(TokenA).safeApprove(router, tokenAAmount);
        IERC20(TokenB).safeApprove(router, tokenBAmount);

        (amountA, amountB, liquidity) = IUniswapV2Router01(router).addLiquidity(TokenA, TokenB, tokenAAmount, tokenBAmount, 0, 0, msg.sender, block.timestamp);
        require(liquidity > 0, "AddLiquidity is Unsuccessful");
        // log
        // console.log("TokenA in pair: ", amountA);
        // console.log("TokenB in pair: ", amountB);
        // console.log("send LP is: ", liquidity);
    }
    // swap，用eth买TokenA，TokenA发回EOA地址
    function buyTokenA(uint minTokenAmount) external payable {
        // [weth, token]
        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = TokenA;

        uint[] memory amounts;
        amounts = IUniswapV2Router01(router).swapExactETHForTokens{value: msg.value}(minTokenAmount, path, msg.sender, block.timestamp);
        // log
        // console.log("TokenA's swapAmount is: ", amounts[amounts.length - 1]);
    }


    // swap，用TokenA买TokenB, TokenB留在合约MyTokenMarket上
    // 完成TokenB的兑换后，直接质押到 MasterChef
    function buyTokenBByTokenA(uint amountIn, uint amountOutMin) external {
        IERC20(TokenA).safeTransferFrom(msg.sender, address(this), amountIn);
        IERC20(TokenA).safeApprove(router, amountIn);
        // [TokenA, TokenB]
        address[] memory path = new address[](2);
        path[0] = TokenA;
        path[1] = TokenB;

        uint[] memory amounts;
        amounts = IUniswapV2Router01(router).swapExactTokensForTokens(amountIn, amountOutMin, path, address(this), block.timestamp);
        // swap得到的TokenB数量
        tokenB_Amount = amounts[amounts.length - 1];

        // 质押TokenB到MasterChef,先授权给MasterChef
        IERC20(TokenB).safeApprove(address(chef), tokenB_Amount);
        chef.deposit(tokenB_pid, tokenB_Amount);
    }

    // 取出质押的TokenB，和挖矿收益sushi
    function withdraw() external {
        chef.withdraw(tokenB_pid, tokenB_Amount);
    }

    // 只取收益sushi，留下TokenB
    function withdrawSuShi() external {
        chef.deposit(tokenB_pid, 0);
        // chef.withdraw(tokenB_pid, 0);
    }
    
}