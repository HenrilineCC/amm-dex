// components/LimitOrderExecutor.tsx
import { useEffect } from "react";
import { ethers } from "ethers";
import AMM_ABI from "../abi/AMM.json";
import ERC20_ABI from "../abi/ERC20.json";
import {
  loadOrders,
  updateOrderStatus,
} from "../lib/orders";

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS!;
const tokenA = process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS!;
const tokenB = process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS!;
const DECIMALS = 18;

export default function LimitOrderExecutor() {
  useEffect(() => {
    const interval = setInterval(() => checkAndExecute(), 5000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentPrice = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(AMM_ADDRESS, AMM_ABI, provider);
    const reserveA = await contract.reserveA();
    const reserveB = await contract.reserveB();

    return {
      AtoB:
        Number(ethers.formatUnits(reserveB, DECIMALS)) /
        Number(ethers.formatUnits(reserveA, DECIMALS)),
      BtoA:
        Number(ethers.formatUnits(reserveA, DECIMALS)) /
        Number(ethers.formatUnits(reserveB, DECIMALS)),
    };
  };

  const checkAndExecute = async () => {
    const price = await getCurrentPrice();
    const allOrders = loadOrders();

    for (const order of allOrders) {
      if (order.status !== "pending") continue;
      const now = price[order.direction];
      if (now >= order.targetPrice) {
        try {
          const txHash = await executeSwap(order);
          updateOrderStatus(order.id, "executed", txHash);
          window.dispatchEvent(new Event("priceRefresh")); // 刷新价格
        } catch (err) {
          updateOrderStatus(order.id, "cancelled");
          console.error(`自动执行失败：${order.id}`, err);
        }
      }
    }
  };

  const executeSwap = async (order) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const amm = new ethers.Contract(AMM_ADDRESS, AMM_ABI, signer);

    const tokenIn = order.direction === "AtoB" ? tokenA : tokenB;
    const parsedAmount = ethers.parseUnits(order.amountIn, DECIMALS);
    const tokenContract = new ethers.Contract(tokenIn, ERC20_ABI, signer);

    const allowance = await tokenContract.allowance(order.owner, AMM_ADDRESS);
    if (allowance < parsedAmount) {
      const tx = await tokenContract.approve(AMM_ADDRESS, parsedAmount);
      await tx.wait();
    }

    const tx = await amm.swap(tokenIn, parsedAmount);
    const receipt = await tx.wait();
    if (receipt.status !== 1) throw new Error("Swap 失败");
    return tx.hash;
  };

  return null;
}