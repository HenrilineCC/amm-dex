// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    uint256 public pricePerToken = 0.001 ether; // 每个 Token 售价 0.001 ETH

    constructor(string memory name, string memory symbol)
        ERC20(name, symbol)
        Ownable(msg.sender)
    {}

    // ✅ 允许管理员铸币
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // ✅ 用户购买 Token 的入口
    function buyToken() public payable {
        require(msg.value > 0, "Need to send ETH");
        uint256 amountToBuy = (msg.value * 1e18) / pricePerToken; // 转换为 token 单位（18位）
        _mint(msg.sender, amountToBuy);
    }

    // ✅ fallback/receive 自动触发 buyToken
    receive() external payable {
        buyToken();
    }

    fallback() external payable {
        buyToken();
    }

    // ✅ 管理员提现合约收到的 ETH
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // ✅ 设置价格（仅管理员）
    function setPrice(uint256 newPriceInWei) external onlyOwner {
        pricePerToken = newPriceInWei;
    }
}