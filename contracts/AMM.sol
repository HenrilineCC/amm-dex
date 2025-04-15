// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AMM is ERC20, Ownable {
    address public tokenA;
    address public tokenB;

    uint256 public reserveA;
    uint256 public reserveB;

    // ========== 动态手续费参数 ==========
    uint256 public baseFee = 3; // 基础手续费 千分之3
    uint256 public maxFee = 30; // 最大手续费 千分之30
    uint256 public feeMultiplier = 10; // 手续费增长控制因子

    // 手续费累积
    uint256 public collectedFeesA;
    uint256 public collectedFeesB;

    mapping(address => bool) public isLP;

    event Swap(address indexed sender, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event AddLiquidity(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event RemoveLiquidity(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event SetFeeRateParams(uint256 base, uint256 max, uint256 multiplier);
    event BuyWithETH(address indexed buyer, address tokenOut, uint256 ethIn, uint256 tokenAmount);
    event FeesWithdrawn(address indexed to, uint256 amountA, uint256 amountB);

    constructor(address _tokenA, address _tokenB) ERC20("LP Token", "LPT") Ownable(msg.sender) {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    // ========== 动态手续费计算 ==========
    function getDynamicFeeRate(uint256 amountIn, uint256 reserveIn) public view returns (uint256) {
        if (reserveIn == 0) return maxFee;
        uint256 ratio = (amountIn * 1000) / reserveIn; // 占储备的千分比
        uint256 dynamic = baseFee + (ratio * feeMultiplier) / 100;
        if (dynamic > maxFee) return maxFee;
        return dynamic;
    }

    function setFeeRateParams(uint256 _baseFee, uint256 _maxFee, uint256 _multiplier) external onlyOwner {
        require(_baseFee <= _maxFee, "base > max");
        baseFee = _baseFee;
        maxFee = _maxFee;
        feeMultiplier = _multiplier;
        emit SetFeeRateParams(_baseFee, _maxFee, _multiplier);
    }
    function getExpectedFeeRate(address tokenIn, uint256 amountIn) external view returns (uint256) {
        require(tokenIn == tokenA || tokenIn == tokenB, "invalid token");
        uint256 reserveIn = tokenIn == tokenA ? reserveA : reserveB;
        return getDynamicFeeRate(amountIn, reserveIn);
    }
    function setLP(address user, bool status) external onlyOwner {
        isLP[user] = status;
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external {
        require(isLP[msg.sender], "Not allowed: Not LP");

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
        require(isLP[msg.sender], "Not allowed: Not LP");

        uint256 amountA = (amount * reserveA) / totalSupply();
        uint256 amountB = (amount * reserveB) / totalSupply();

        _burn(msg.sender, amount);
        reserveA -= amountA;
        reserveB -= amountB;

        IERC20(tokenA).transfer(msg.sender, amountA);
        IERC20(tokenB).transfer(msg.sender, amountB);

        emit RemoveLiquidity(msg.sender, amountA, amountB, amount);
    }

    function swap(address tokenIn, uint256 amountIn, uint256 minAmountOut) external {
        require(tokenIn == tokenA || tokenIn == tokenB, "Invalid token");

        bool isA = tokenIn == tokenA;
        address tokenOut = isA ? tokenB : tokenA;

        uint256 reserveIn = isA ? reserveA : reserveB;
        uint256 reserveOut = isA ? reserveB : reserveA;

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        uint256 dynamicFee = getDynamicFeeRate(amountIn, reserveIn);
        uint256 feeAmount = (amountIn * dynamicFee) / 1000;
        uint256 amountInWithFee = amountIn - feeAmount;
        uint256 amountOut = (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);

        require(amountOut >= minAmountOut, "Slippage too high");

        if (isA) {
            collectedFeesA += feeAmount;
            reserveA += amountInWithFee;
            reserveB -= amountOut;
        } else {
            collectedFeesB += feeAmount;
            reserveB += amountInWithFee;
            reserveA -= amountOut;
        }

        IERC20(tokenOut).transfer(msg.sender, amountOut);
        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }

    function buyWithETH(address tokenOut) external payable {
        require(tokenOut == tokenA || tokenOut == tokenB, "Invalid token");

        bool isBuyingA = tokenOut == tokenA;
        uint256 reserveIn = isBuyingA ? reserveB : reserveA;
        uint256 reserveOut = isBuyingA ? reserveA : reserveB;

        require(reserveOut > 0 && reserveIn > 0, "Empty pool");

        uint256 dynamicFee = getDynamicFeeRate(msg.value, reserveIn);
        uint256 feeAmount = (msg.value * dynamicFee) / 8000;
        uint256 amountInWithFee = msg.value - feeAmount;

        uint256 tokenAmountOut = (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);
        require(tokenAmountOut > 0, "Insufficient output");

        if (isBuyingA) {
            collectedFeesB += feeAmount;
            reserveB += amountInWithFee;
            reserveA -= tokenAmountOut;
        } else {
            collectedFeesA += feeAmount;
            reserveA += amountInWithFee;
            reserveB -= tokenAmountOut;
        }

        IERC20(tokenOut).transfer(msg.sender, tokenAmountOut);

        emit BuyWithETH(msg.sender, tokenOut, msg.value, tokenAmountOut);
        emit Swap(msg.sender, address(0), tokenOut, msg.value, tokenAmountOut);
    }

    function withdrawFees() external onlyOwner {
        uint256 a = collectedFeesA;
        uint256 b = collectedFeesB;

        if (a > 0) {
            collectedFeesA = 0;
            IERC20(tokenA).transfer(owner(), a);
        }
        if (b > 0) {
            collectedFeesB = 0;
            IERC20(tokenB).transfer(owner(), b);
        }

        emit FeesWithdrawn(owner(), a, b);
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

    receive() external payable {}
}