import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { List, Typography, Tag, Card } from "antd";
import AMM_ABI from "../abi/AMM.json";
import theme from "../components/theme";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS!;
const DECIMALS = 18;

type EventRecord = {
  type: string;
  from: string;
  amountA?: string;
  amountB?: string;
  liquidity?: string;
  txHash: string;
  blockNumber: number;
};

export default function HistoryPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);

  useEffect(() => {
    if (window.ethereum) {
      fetchEvents();
    }
  }, []);

  const fetchEvents = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(AMM_ADDRESS, AMM_ABI, provider);

    const all: EventRecord[] = [];

    // 🔄 Swap
    const swapLogs = await contract.queryFilter(
      contract.getEvent("Swap"),
      0,
      "latest"
    );
    swapLogs.forEach((log) => {
      const [sender, tokenIn, tokenOut, amountIn, amountOut] = log.args;
      all.push({
        type: "Swap",
        from: sender,
        amountA: ethers.formatUnits(amountIn, DECIMALS),
        amountB: ethers.formatUnits(amountOut, DECIMALS),
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
      });
    });

    // ➕ AddLiquidity
    const addLogs = await contract.queryFilter(
      contract.getEvent("AddLiquidity"),
      0,
      "latest"
    );
    addLogs.forEach((log) => {
      const [providerAddr, amountA, amountB, liquidity] = log.args;
      all.push({
        type: "AddLiquidity",
        from: providerAddr,
        amountA: ethers.formatUnits(amountA, DECIMALS),
        amountB: ethers.formatUnits(amountB, DECIMALS),
        liquidity: ethers.formatUnits(liquidity, DECIMALS),
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
      });
    });

    // ➖ RemoveLiquidity
    const removeLogs = await contract.queryFilter(
      contract.getEvent("RemoveLiquidity"),
      0,
      "latest"
    );
    removeLogs.forEach((log) => {
      const [providerAddr, amountA, amountB, liquidity] = log.args;
      all.push({
        type: "RemoveLiquidity",
        from: providerAddr,
        amountA: ethers.formatUnits(amountA, DECIMALS),
        amountB: ethers.formatUnits(amountB, DECIMALS),
        liquidity: ethers.formatUnits(liquidity, DECIMALS),
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
      });
    });

    // 排序：最新在上
    setEvents(all.sort((a, b) => b.blockNumber - a.blockNumber));
  };

  return (
    <Layout>
      <Navbar />
      <div style={{ 
        maxWidth: 800, 
        margin: "auto", 
        padding: "2rem",
        background: theme.background,
        borderRadius: 20,
        boxShadow: theme.cardShadow,
        marginTop: 16
      }}>
      <Typography.Title level={3} style={{ color: theme.textColor }}>📜 交易 & 流动性历史记录</Typography.Title>

      <List
        dataSource={events}
        renderItem={(item) => (
          <Card style={{ 
  marginBottom: "1rem",
  background: theme.background,
  borderRadius: 12,
  boxShadow: theme.cardShadow
}}>
            <Typography.Text>
              类型：
              <Tag color={
                item.type === "Swap" ? "blue" :
                item.type === "AddLiquidity" ? "green" :
                "red"
              }>
                {item.type}
              </Tag>
              <br />
              地址：{item.from}
              <br />
              {item.type === "Swap" && (
                <>
                  Token In: {item.amountA} → Token Out: {item.amountB}
                </>
              )}
              {(item.type === "AddLiquidity" || item.type === "RemoveLiquidity") && (
                <>
                  Token A: {item.amountA}, Token B: {item.amountB} <br />
                  LP: {item.liquidity}
                </>
              )}
              <br />
              区块号：{item.blockNumber}
              <br />
              <a href={`https://sepolia.etherscan.io/tx/${item.txHash}`} target="_blank" rel="noreferrer">
                查看交易
              </a>
            </Typography.Text>
          </Card>
        )}
      />
      </div>
    </Layout>
  );
}