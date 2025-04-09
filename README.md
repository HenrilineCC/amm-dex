# 🧮 AMM DEX

基于 AMM 自动化做市机制的去中心化交易平台，实现了基本的 Swap、流动性管理、限价单挂单撮合、图表分析等核心功能。支持本地部署及测试网运行。

---

## ✨ 功能特性

- ✅ Swap 交易（Token A ↔ B）
- ✅ 添加 / 移除流动性（LP Token）
- ✅ 限价交易（自动监听并执行）
- ✅ 实时价格展示（AtoB / BtoA）
- ✅ 图表分析（K线、储备、交易量、流动性、价格走势）
- ✅ 状态追踪与订单记录
- ✅ 基于 Ethers.js 实现的纯前端 Web3 钱包连接
- ✅ 全局价格组件自动刷新同步
- ✅ 支持滑点容忍机制

---

## 🛠 技术栈

- **前端**：React + Next.js + TypeScript + Ant Design
- **Web3**：Ethers.js + MetaMask
- **合约**：Solidity + Hardhat
- **图表**：ECharts
- **部署网络**：Hardhat localhost / Sepolia

---

## 🚀 快速开始

### 1️⃣ 克隆仓库

```bash
git clone https://github.com/HenrilineCC/amm-dex.git
cd amm-dex

# 安装合约和前端依赖
npm install
cd frontend
npm install

# 启动本地链
npx hardhat node

# 编译合约
npx hardhat compile

# 部署合约（部署 TokenA、TokenB、AMM）
npx hardhat run scripts/deploy.ts --network localhost

NEXT_PUBLIC_AMM_ADDRESS=0x...
NEXT_PUBLIC_TOKEN_A_ADDRESS=0x...
NEXT_PUBLIC_TOKEN_B_ADDRESS=0x...
启动前端
cd frontend
npm run dev
http://localhost:3000

📊 图表说明
	•	K线图：基于 Swap 和流动性操作生成价格走势
	•	Token 储备量图：池中 Token A / B 储备变化
	•	Swap 成交量图：交易数量统计
	•	LP 流动性变化图：当前池中 LP 总值变动
	•	价格走势图：Token A 和 Token B 价格历史变化

🔐 滑点保护说明

Swap 操作中默认支持设置滑点（如 0.5%、1%），前端传入 minAmountOut 参数，避免交易恶意滑价。

✅ 合同事件
	•	Swap(address sender, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut)
	•	AddLiquidity(address provider, uint256 amountA, uint256 amountB, uint256 liquidity)
	•	RemoveLiquidity(address provider, uint256 amountA, uint256 amountB, uint256 liquidity)