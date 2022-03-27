//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol';
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract AddLiquidity{
    using SafeERC20 for IERC20;

    address public TokenA;
    address public TokenB;
    address public router01;

    constructor(address _tokenA, address _tokenB, address _router01){
        TokenA = _tokenA;
        TokenB = _tokenB;
        router01 = _router01;
    }

    // Uniswap V2 添加流动性: DOG & CAT    
    function AddLiquidityByTokenA_TokenB(uint _tokenA_Amount, uint _tokenB_Amount) external payable returns(uint amountA, uint amountB, uint liquidity){
        // 授权转账到AddLiquidity合约中
        IERC20(TokenA).safeTransferFrom(msg.sender, address(this), _tokenA_Amount);
        IERC20(TokenB).safeTransferFrom(msg.sender, address(this), _tokenB_Amount);
        // AddLiquidity授权给router01
        IERC20(TokenA).safeApprove(router01, _tokenA_Amount);
        IERC20(TokenB).safeApprove(router01, _tokenB_Amount);
        // 添加流动性
        (amountA, amountB, liquidity) = IUniswapV2Router01(router01).addLiquidity(TokenA, TokenB, _tokenA_Amount, _tokenB_Amount, 0, 0, msg.sender, block.timestamp);
        require(liquidity > 0, "AddLiquidity is Unsuccessful");
        // 将没有添加进池子的tokenA和tokenB返还给msg.sender
        if(_tokenA_Amount > amountA){
            IERC20(TokenA).safeTransfer(msg.sender, (_tokenA_Amount - amountA));
        }
        if(_tokenB_Amount > amountB){
            IERC20(TokenB).safeTransfer(msg.sender, (_tokenB_Amount - amountB));
        }
    }



}