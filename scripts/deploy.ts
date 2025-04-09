import { ethers } from "hardhat";

type ERC20Extended = {
  mint: (to: string, amount: bigint) => Promise<any>;
  approve: (spender: string, amount: bigint) => Promise<any>;
  getAddress: () => Promise<string>;
};

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  // 1️⃣ 部署 Token A
  const TokenFactory = await ethers.getContractFactory("MyToken");
  const tokenAContract = await TokenFactory.deploy("Token A", "TKA");
  await tokenAContract.waitForDeployment();
  const tokenA = tokenAContract as unknown as ERC20Extended;
  const tokenAAddress = await tokenA.getAddress();

  // 2️⃣ 部署 Token B
  const tokenBContract = await TokenFactory.deploy("Token B", "TKB");
  await tokenBContract.waitForDeployment();
  const tokenB = tokenBContract as unknown as ERC20Extended;
  const tokenBAddress = await tokenB.getAddress();

  console.log("Token A deployed to:", tokenAAddress);
  console.log("Token B deployed to:", tokenBAddress);

  // 3️⃣ 部署 AMM 合约（owner 默认是 deployer）
  const AMM = await ethers.getContractFactory("AMM");
  const ammContract = await AMM.deploy(tokenAAddress, tokenBAddress);
  await ammContract.waitForDeployment();
  const ammAddress = await ammContract.getAddress();
  console.log("AMM deployed to:", ammAddress);

  // 4️⃣ 设置 deployer 为 LP 用户（必需！）
  await ammContract.setLP(deployer.address, true);
  console.log("✅ 已将 deployer 设置为 LP 用户");

  // 5️⃣ Mint 10000 TokenA/B 给 deployer
  const mintAmount = ethers.parseUnits("3000", 18);
  await tokenA.mint(deployer.address, mintAmount);
  await tokenB.mint(deployer.address, mintAmount);
  console.log("Minted 3000 A/B tokens to deployer");

  // 6️⃣ Approve 并添加初始流动性（1000 A : 2000 B）
  const initialAmountA = ethers.parseUnits("1000", 18);
  const initialAmountB = ethers.parseUnits("2000", 18);
  await tokenA.approve(ammAddress, initialAmountA);
  await tokenB.approve(ammAddress, initialAmountB);
  await ammContract.addLiquidity(initialAmountA, initialAmountB);

  console.log("✅ 初始流动性已添加成功");
}

main().catch((err) => {
  console.error("❌ 部署出错：", err);
  process.exitCode = 1;
});