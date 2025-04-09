import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button, Input, Typography, Select, Divider, Table } from "antd";
import { v4 as uuidv4 } from "uuid";
import AMM_ABI from "../abi/AMM.json";
import Layout from "../components/Layout";
import ERC20_ABI from "../abi/ERC20.json";
import {
  saveOrder,
  loadOrders,
  updateOrderStatus,
  removeOrder,
  LimitOrder,
} from "../lib/orders";

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS!;
const tokenA = process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS!;
const tokenB = process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS!;
const DECIMALS = 18;

export default function LimitPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [direction, setDirection] = useState<"AtoB" | "BtoA">("AtoB");
  const [amountIn, setAmountIn] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [orders, setOrders] = useState<LimitOrder[]>([]);

  useEffect(() => {
    if (window.ethereum) connectWallet();
    setOrders(loadOrders());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => checkAndExecute(), 5000);
    return () => clearInterval(interval);
  }, []);

  const connectWallet = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  };

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
          window.dispatchEvent(new Event("priceRefresh")); // 刷新全局价格
        } catch (err) {
          console.error(`订单 ${order.id} 执行失败`, err);
          updateOrderStatus(order.id, "cancelled");
        }
      }
    }

    setOrders(loadOrders());
  };

  const executeSwap = async (order: LimitOrder) => {
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
    if (receipt.status !== 1) throw new Error("Swap 交易失败");

    return tx.hash;
  };

  const handleSubmit = () => {
    if (!account || !amountIn || !targetPrice) return;

    const order: LimitOrder = {
      id: uuidv4(),
      owner: account,
      direction,
      amountIn,
      targetPrice: parseFloat(targetPrice),
      placedAt: new Date().toISOString(),
      status: "pending",
    };

    saveOrder(order);
    setOrders(loadOrders());
  };

  const handleCancel = (id: string) => {
    removeOrder(id);
    setOrders(loadOrders());
  };

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "auto", padding: "2rem" }}>
        <Typography.Title level={3}>📊 限价交易</Typography.Title>

        <Select
          value={direction}
          onChange={(val) => setDirection(val)}
          style={{ width: "100%", marginBottom: 20 }}
          options={[
            { label: "Token A → B", value: "AtoB" },
            { label: "Token B → A", value: "BtoA" },
          ]}
        />

        <Input
          placeholder="输入希望交易数量"
          value={amountIn}
          onChange={(e) => setAmountIn(e.target.value)}
          style={{ marginBottom: 20 }}
        />

        <Input
          placeholder="目标价格（达到后触发）"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          style={{ marginBottom: 20 }}
        />

        <Button type="primary" block onClick={handleSubmit}>
          下达限价单
        </Button>

        <Divider />
        <Typography.Title level={4}>📜 限价订单历史</Typography.Title>
        <Table
          dataSource={orders}
          rowKey="id"
          columns={[
            { title: "方向", dataIndex: "direction" },
            { title: "数量", dataIndex: "amountIn" },
            { title: "目标价", dataIndex: "targetPrice" },
            { title: "状态", dataIndex: "status" },
            {
              title: "成交哈希",
              dataIndex: "txHash",
              render: (hash) =>
                hash ? (
                  <a
                    href={`https://sepolia.etherscan.io/tx/${hash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    查看
                  </a>
                ) : (
                  "-"
                ),
            },
            {
              title: "操作",
              render: (_, record) =>
                record.status === "pending" ? (
                  <Button danger size="small" onClick={() => handleCancel(record.id)}>
                    取消
                  </Button>
                ) : (
                  "-"
                ),
            },
          ]}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </Layout>
  );
}