// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AMM is ERC20 {
    address public tokenA;
    address public tokenB;

    uint256 public reserveA;
    uint256 public reserveB;

    event Swap(address indexed sender, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event AddLiquidity(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event RemoveLiquidity(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);

    constructor(address _tokenA, address _tokenB) ERC20("LP Token", "LPT") {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external {
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountB);

        uint256 liquidity;
        if (totalSupply() == 0) {
            liquidity = sqrt(amountA * amountB);
        } else {
            liquidity = min((amountA * totalSupply()) / reserveA, (amountB * totalSupply()) / reserveB);
        }

        _mint(msg.sender, liquidity);
        reserveA += amountA;
        reserveB += amountB;

        emit AddLiquidity(msg.sender, amountA, amountB, liquidity);
    }

    function removeLiquidity(uint256 amount) external {
        uint256 amountA = (amount * reserveA) / totalSupply();
        uint256 amountB = (amount * reserveB) / totalSupply();

        _burn(msg.sender, amount);
        reserveA -= amountA;
        reserveB -= amountB;

        IERC20(tokenA).transfer(msg.sender, amountA);
        IERC20(tokenB).transfer(msg.sender, amountB);

        emit RemoveLiquidity(msg.sender, amountA, amountB, amount);
    }

    // ✅ 新版本：Swap with Slippage Protection
    function swap(address tokenIn, uint256 amountIn, uint256 minAmountOut) external {
        require(tokenIn == tokenA || tokenIn == tokenB, "Invalid token");

        bool isA = tokenIn == tokenA;
        address tokenOut = isA ? tokenB : tokenA;

        uint256 reserveIn = isA ? reserveA : reserveB;
        uint256 reserveOut = isA ? reserveB : reserveA;

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        uint256 amountInWithFee = (amountIn * 997) / 1000;
        uint256 amountOut = (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);

        // ✅ 滑点检查
        require(amountOut >= minAmountOut, "Slippage too high");

        IERC20(tokenOut).transfer(msg.sender, amountOut);

        if (isA) {
            reserveA += amountIn;
            reserveB -= amountOut;
        } else {
            reserveB += amountIn;
            reserveA -= amountOut;
        }

        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }

    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function min(uint x, uint y) internal pure returns (uint) {
        return x < y ? x : y;
    }
}